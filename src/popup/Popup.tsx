import cx from 'classnames'
import { isNil, omit } from 'lodash'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import browser from 'webextension-polyfill'
import feedbackIcon from '../assets/icons/feedback.svg'
import logo from '../assets/icons/logo.svg'
import '../i18n'
import '../styles/global.css'
import { ActionResponse, CheckResult, MessageType, STORAGE_KEY } from '../types/messaging'
import { getLogger } from '../utils/logger'
import Button from './Button'
import ResultMain from './ResultMain'

const logger = getLogger('popup')

export interface PopupParams {
  reqId: string
  tabId: string
}

const Popup: FC<{}> = () => {
  const { t } = useTranslation()
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)

  const params = useMemo(() => {
    const p = new URLSearchParams(window.location.search)
    return Object.fromEntries(p.entries()) as any as PopupParams
  }, [])

  const setState = useCallback((checkResults?: { [id: string]: CheckResult }) => {
    logger.debug('set state', checkResults, params.reqId)
    if (isNil(checkResults)) {
      return
    }
    if (Object.keys(checkResults).length === 0) {
      setCheckResult(null)
      return
    }
    const result = checkResults[params.reqId]
    setCheckResult(result)
  }, [])

  useEffect(() => {
    ;(async () => {
      const storage = await browser.storage.local.get(STORAGE_KEY)
      setState(storage && storage[STORAGE_KEY])
      browser.storage.onChanged.addListener((changes, area) => {
        logger.debug('storage change', changes)
        if (area === 'local' && changes[STORAGE_KEY]?.newValue) {
          const storage = changes[STORAGE_KEY]?.newValue
          setState(storage)
        }
      })
    })()
  }, [])

  const doAction = useCallback(
    async (action: ActionResponse) => {
      logger.info('action', params, action)
      const checkResults = await browser.storage.local.get(STORAGE_KEY)
      await browser.storage.local.set({
        [STORAGE_KEY]: omit(checkResults[STORAGE_KEY], params.reqId),
      })
      await browser.tabs.sendMessage(Number(params.tabId), {
        type: MessageType.UserAction,
        reqId: params.reqId,
        action,
      })
      window.close()
    },
    [checkResult],
  )

  return (
    <div className="w-full h-screen flex flex-col flex-1">
      <div className="w-full shrink-0 border-b border-[#dbdbdb] flex flex-row justify-between py-4 px-5">
        <img src={logo} />
        <a target="_blank" href="https://support.tutum.app" title="Feedback">
          <img src={feedbackIcon} />
        </a>
      </div>
      <div className="grow p-5 overflow-scroll">
        {checkResult ? (
          <ResultMain checkResult={checkResult} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-sm">{t('textChecking', 'Checking...')}</span>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-5 py-4 px-5 border-t-[0.5px] border-[#dbdbdb]">
        <Button className="text-black bg-[#F0F0F0]" onClick={() => doAction(ActionResponse.Reject)}>
          {t('btnReject')}
        </Button>
        {checkResult ? (
          <Button
            className={cx('text-white', checkResult?.warnings?.length ? 'bg-red' : 'bg-blue')}
            onClick={() => doAction(ActionResponse.Pass)}
          >
            {t('btnContinue')}
          </Button>
        ) : (
          <Button className="text-white bg-red" onClick={() => doAction(ActionResponse.Skip)}>
            {t('btnSkip')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Popup

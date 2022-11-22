import browser from 'webextension-polyfill'
import {
  CheckResult,
  DispatchActionResponse,
  DispatchRequest,
  DISPATCH_REQUEST,
  DISPATCH_RESULT,
  MessageType,
  STORAGE_KEY,
} from '../types/messaging'
import { getLogger } from '../utils/logger'

const logger = getLogger('contentScript')

const inflightReqIds = new Set<string>()

browser.runtime.onMessage.addListener((message) => {
  logger.info('Got message from injected', message)
  if (message.type === MessageType.UserAction) {
    const data = message as DispatchActionResponse
    inflightReqIds.delete(data.reqId)
    document.dispatchEvent(new CustomEvent(DISPATCH_RESULT, { detail: data }))
  }
})

document.addEventListener(DISPATCH_REQUEST, async (e) => {
  const evt = e as CustomEvent<DispatchRequest>
  logger.info('Got DISPATCH_REQUEST event from injected', evt)
  inflightReqIds.add(evt.detail.reqId)
  const result: CheckResult = await browser.runtime.sendMessage({
    type: MessageType.TransactionRequest,
    data: evt.detail,
  })
  logger.info('Got tx request check result from bg script', result)
  if (inflightReqIds.has(result.reqId)) {
    const checkResults = await browser.storage.local.get(STORAGE_KEY)
    await browser.storage.local.set({
      [STORAGE_KEY]: {
        ...checkResults[STORAGE_KEY],
        [result.reqId]: result,
      },
    })
  } else {
    logger.debug('Ignore stale request', result.reqId)
  }
})

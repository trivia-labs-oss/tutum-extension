import _ from 'lodash'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ApproveWarning, CheckResult } from '../types/messaging'
import ApproveSection from './ApproveSection'
import InteractingWith from './InteractingWith'
import SimulationSection from './SimulationSection'
import CommonWarning from './Warnings/CommonWarning'
import DomainWarning from './Warnings/DomainWarning'

interface Props {
  checkResult: CheckResult
}

const ResultMain: FC<Props> = ({ checkResult }) => {
  const { t } = useTranslation()

  const approveWarnings = useMemo(() => {
    const grouped = _.groupBy(checkResult.warnings || [], (w) => w.type)
    return (grouped['approve'] || []) as ApproveWarning[]
  }, [checkResult.warnings])

  return (
    <div className="w-full">
      {checkResult.warnings?.map((w) => {
        switch (w.type) {
          case 'domain':
            return <DomainWarning warning={w} className="mb-5" />
          case 'text':
            return (
              <CommonWarning
                className="mb-5"
                message={t([w.i18nKey, 'textCommonWarningMessage'])}
              />
            )
          case 'approve':
            if (w.isSafeOperator) {
              return null
            }
          // show common warning
          default:
            return <CommonWarning className="mb-5" message={t('textCommonWarningMessage')} />
        }
      })}
      {checkResult.toAddressInfo && <InteractingWith {...checkResult.toAddressInfo} />}
      {approveWarnings.length > 0 ? (
        <ApproveSection data={approveWarnings[0]} />
      ) : (
        checkResult.simulation && <SimulationSection result={checkResult.simulation} />
      )}
    </div>
  )
}

export default ResultMain

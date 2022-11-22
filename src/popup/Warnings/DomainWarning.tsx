import React, { FC } from 'react'
import { Trans } from 'react-i18next'
import { DomainCheckWarning } from '../../types/messaging'
import CommonWarning from './CommonWarning'

const DomainWarning: FC<{ className?: string; warning: DomainCheckWarning }> = ({
  className,
  warning,
}) => {
  const refUrl = new URL(warning.refUrl)
  const { name, website } = warning.dapp
  return (
    <CommonWarning
      className={className}
      message={
        <Trans i18nKey="textDomainWarningMessage" values={{ name, website }}>
          you are interacting with <span className="font-bold">{name}</span> contract, but you are
          not on <span className="">{website}</span>. pls double check
        </Trans>
      }
    >
      <hr className="my-2 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-grey opacity-50">Official site</span>
          <span className="max-w-[250px]">{website}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-grey opacity-50">This site</span>
          <span className="max-w-[250px]">{refUrl.origin}</span>
        </div>
      </div>
    </CommonWarning>
  )
}

export default DomainWarning

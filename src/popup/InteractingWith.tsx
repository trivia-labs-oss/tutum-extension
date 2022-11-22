import React, { FC, useCallback, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import copiedIcon from '../assets/icons/copied.svg'
import copyIcon from '../assets/icons/copy.svg'
import etherscanIcon from '../assets/icons/etherscan.svg'
import { AddressInfo } from '../types/messaging'
import { shortenEthreumAddress } from '../utils'
import Section from './Section'

const Seperator = () => <span className="h-full w-[1px] bg-[#dbdbdb] mx-1"></span>

const CopyButton: FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(() => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 500)
  }, [])

  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <img src={copied ? copiedIcon : copyIcon} className="cursor-pointer" />
    </CopyToClipboard>
  )
}

const InteractingWith: FC<AddressInfo> = (props) => {
  const { t } = useTranslation()
  return (
    <Section title={t('textInteractingWithTitle')}>
      <div className="flex flex-row justify-between gap-2 flex-1">
        <div className="flex flex-row items-center shrink overflow-hidden">
          <span className="font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis">
            {props.name || t('textUnknown')}
          </span>
        </div>
        <div className="rounded-md border border-[#dbdbdb] flex flex-row items-center shrink-0">
          <span className="text-[#808080] font-medium p-1 pl-2">
            {shortenEthreumAddress(props.address)}
          </span>
          <Seperator />
          <CopyButton text={props.address} />
          <Seperator />
          <a href={`https://etherscan.io/address/${props.address}`} target="_blank">
            <img src={etherscanIcon} className="mr-1" />
          </a>
        </div>
      </div>
    </Section>
  )
}

export default InteractingWith

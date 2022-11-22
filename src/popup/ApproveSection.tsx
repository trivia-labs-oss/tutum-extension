import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dotLine from '../assets/icons/dot-line.svg'
import imageFallback from '../assets/icons/image-fallback.svg'
import { ApproveWarning } from '../types/messaging'
import { shortenEthreumAddress } from '../utils'
import Section from './Section'

const ProfileCard: FC<{ name: string; image: string; address?: string }> = (props) => {
  return (
    <div className="flex flex-row items-center gap-[10px] p-[10px] rounded-[10px] border-2 border-blue border-opacity-20 w-full">
      <img className="w-10 h-10 rounded-[8px]" src={props.image} />
      <div className="flex flex-col justify-between h-full min-w-0">
        <span className="text-sm font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
          {props.name}
        </span>
        {!!props.address && (
          <span className="font-medium text-[#808080]">{shortenEthreumAddress(props.address)}</span>
        )}
      </div>
    </div>
  )
}

const ApproveSection: FC<{ data: ApproveWarning }> = ({ data }) => {
  const { t } = useTranslation()
  return (
    <Section title={t('simulationTitle')} className="mt-[30px]">
      <div className="flex flex-col">
        <ProfileCard
          name={data.operator.name || t('textUnknown')}
          image={data.operator.image || imageFallback}
          address={data.operator.address}
        />
        <div className="my-1">
          <img src={dotLine} className="ml-8" />
          <span className="text-[#808080] font-medium ml-3">{t('textCanWithdraw')}</span>
          <img src={dotLine} className="ml-8" />
        </div>
        <ProfileCard
          name={data.asset.name || t('textUnknown')}
          image={data.asset.image || imageFallback}
          address={data.asset.address}
        />
      </div>
    </Section>
  )
}

export default ApproveSection

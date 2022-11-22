import cx from 'classnames'
import React, { FC, PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import alertIcon from '../../assets/icons/alert.svg'

type Props = PropsWithChildren<{
  className?: string
  message: string | ReactNode
}>

const CommonWarning: FC<Props> = (props) => {
  const { t } = useTranslation()
  return (
    <div
      className={cx('bg-red bg-opacity-20 rounded-[10px] p-[15px] flex flex-col', props.className)}
    >
      <div className="flex flex-row items-center mb-[6px]">
        <img src={alertIcon} className="w-5 h-5 mr-[5px]" />
        <span className="font-bold text-lg">{t('textWarning')}</span>
      </div>
      <span className="text-grey">{props.message}</span>
      {props.children}
    </div>
  )
}

export default CommonWarning

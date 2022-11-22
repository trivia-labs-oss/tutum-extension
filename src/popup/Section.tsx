import React, { FC, PropsWithChildren } from 'react'
import cx from 'classnames'

type Props = PropsWithChildren<{
  title: string
  className?: string
}>

const Section: FC<Props> = (props) => {
  return (
    <div className={cx('flex flex-col', props.className)}>
      <div className="flex flex-row items-center gap-2 mb-5">
        <span className="text-[#808080] font-medium">{props.title}</span>
        <hr className="h-[1px] grow" />
      </div>
      {props.children}
    </div>
  )
}

export default Section

import cx from 'classnames'
import React, { FC } from 'react'

type Props = React.HTMLAttributes<HTMLButtonElement>

const Button: FC<Props> = ({ className, ...props }) => {
  return <button {...props} className={cx('rounded-[20px] font-bold py-3 w-full', className)} />
}

export default Button

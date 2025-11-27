import { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`text-white text-base font-medium leading-normal pb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
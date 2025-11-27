import { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl 
        text-form-text focus:outline-0 focus:ring-0 border border-form-border 
        bg-form-bg focus:border-primary h-14 p-[15px] text-base font-normal 
        leading-normal placeholder:text-form-placeholder 
        disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  )
}

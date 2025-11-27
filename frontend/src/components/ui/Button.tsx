import Link from 'next/link'

type ButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
}

// Um componente de botão simples que usa Next.js Link
export function Button({ href, children, className = '' }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-primary/80 ${className}`}
    >
      <span className="truncate">{children}</span>
    </Link>
  )
}
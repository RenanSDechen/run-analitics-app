import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

type LandingHeaderProps = {
  onLoginClick: () => void
}

export function LandingHeader({ onLoginClick }: LandingHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-10 lg:px-40 py-6 w-full z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 text-white">
        <Logo className="size-8 text-primary" />
        <span className="text-xl font-bold tracking-tight hidden sm:block">Runalytics</span>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-4">
        <button
          onClick={onLoginClick}
          className="text-white font-medium hover:text-primary transition-colors text-sm md:text-base px-4 py-2"
        >
          Entrar
        </button>
        
        <Link
          href="/signup"
          className="hidden sm:flex h-10 items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Começar Agora
        </Link>
      </div>
    </header>
  )
}
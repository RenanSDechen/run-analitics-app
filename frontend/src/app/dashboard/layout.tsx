import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { UserDropdown } from '@/components/dashboard/UserDropdown' // <--- IMPORTAR

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-card-border px-4 md:px-10 py-3 bg-background-dark/95 backdrop-blur supports-[backdrop-filter]:bg-background-dark/60 sticky top-0 z-40">
        
        {/* Logo e Nome */}
        <div className="flex items-center gap-4 text-white">
          <Link href="/dashboard" className="flex items-center gap-4">
            <Logo className="size-6 text-primary" />
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
              Runalytics
            </h2>
          </Link>
        </div>

        {/* Navegação e Perfil */}
        <div className="flex flex-1 justify-end gap-8 items-center">
          
          {/* Menu de Navegação (Escondido em mobile se quiser, mas mantive simples) */}
          <nav className="hidden md:flex items-center gap-9">
            <Link
              className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-text-light text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/dashboard/history"
            >
              Histórico
            </Link>
            <Link
              className="text-text-light text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/dashboard/plan"
            >
              Plano
            </Link>
          </nav>

          {/* O NOVO DROPDOWN ENTRA AQUI */}
          <UserDropdown />
          
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-[1440px] mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
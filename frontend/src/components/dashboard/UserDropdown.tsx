'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function UserDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 1. Carrega o nome do usuário ao montar
  useEffect(() => {
    const storedName = localStorage.getItem('run_username')
    if (storedName) {
      // Pega apenas o primeiro nome para não quebrar o layout
      setUserName(storedName.split(' ')[0])
    }
  }, [])

  // 2. Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 3. Função de Logout
  const handleLogout = () => {
    // Limpa os dados de sessão
    localStorage.removeItem('run_token')
    localStorage.removeItem('run_userid')
    localStorage.removeItem('run_username')
    
    // Redireciona para login (ou home)
    router.push('/') // ou '/login'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de Trigger (Avatar) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center h-10 w-10 rounded-full 
          transition-all duration-200 border border-transparent
          ${isOpen ? 'bg-primary text-background-dark' : 'bg-button-secondary-bg text-white hover:bg-primary/20'}
        `}
      >
        <span className="material-symbols-outlined">person</span>
      </button>

      {/* O Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl bg-card-bg border border-card-border shadow-lg shadow-black/50 animate-in fade-in zoom-in-95 duration-200 z-50">
          
          {/* Cabeçalho do Menu */}
          <div className="px-4 py-3 border-b border-card-border">
            <p className="text-xs text-text-light font-medium uppercase tracking-wider">
              Logado como
            </p>
            <p className="text-white font-bold truncate mt-1">
              {userName || 'Atleta'}
            </p>
          </div>

          {/* Opções */}
          <div className="p-1">
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-light hover:bg-button-secondary-hover hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Configurações
            </button>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sair da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { HistoryEntry, HistoryItem } from '@/components/dashboard/HistoryItem'
import { AddWorkoutModal } from '@/components/dashboard/AddWorkoutModal'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [upcoming, setUpcoming] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchHistory = async () => {
    const userId = localStorage.getItem('run_userid')
    const token = localStorage.getItem('run_token')

    if (!userId) return

    try {
      const res = await fetch(`http://localhost:8081/api/Workout/history/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data: HistoryEntry[] = await res.json()
        
        const now = new Date()
        now.setHours(0,0,0,0) // Zera horas para comparação justa

        // 1. Filtra Passado (Histórico)
        // Regra: Treinos completados OU treinos passados
        const pastLogs = data.filter(log => 
          log.status === 1 || new Date(log.date) < now
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Mais recente primeiro

        // 2. Filtra Futuro (Planejamento)
        // Regra: Treinos pendentes E data >= hoje
        const futureLogs = data.filter(log => 
          log.status !== 1 && new Date(log.date) >= now
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Mais próximo primeiro (Cronológico)

        setHistory(pastLogs)
        setUpcoming(futureLogs)
      }
    } catch (error) {
      console.error("Erro ao carregar histórico", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <>
      <AddWorkoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchHistory} 
      />

      <div className="space-y-12">
        {/* Cabeçalho Principal */}
        <div className="flex flex-col @md:flex-row justify-between @md:items-center gap-4">
          <div>
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Seu Progresso
            </h1>
            <p className="text-text-light mt-2">
              Histórico de atividades realizadas e resultados.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-card-bg border border-card-border text-white text-base font-bold hover:bg-button-secondary-hover transition-colors"
          >
            <span className="material-symbols-outlined mr-2">update</span>
            <span className="truncate">Registrar Conclusão</span>
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-text-light">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4">progress_activity</span>
            <p>Carregando dados...</p>
          </div>
        )}

        {/* SECTION 1: HISTÓRICO (O Presente/Passado) */}
        {!isLoading && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-card-border pb-2">
              <span className="material-symbols-outlined text-primary">history</span>
              <h2 className="text-xl font-bold text-white">Histórico Recente</h2>
            </div>

            {history.length === 0 ? (
              <p className="text-text-light italic">Nenhum treino realizado ou passado encontrado.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {history.map((entry) => (
                  <HistoryItem key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: FUTURO (Planejamento) */}
        {!isLoading && upcoming.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-card-border pb-2 mt-10">
              <span className="material-symbols-outlined text-blue-400">calendar_month</span>
              <h2 className="text-xl font-bold text-white">Próximos Treinos</h2>
            </div>
            
            <div className="flex flex-col gap-6 opacity-90">
              {upcoming.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
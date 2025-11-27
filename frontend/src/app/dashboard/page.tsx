'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '@/components/dashboard/StatCard'
import { AddWorkoutModal } from '@/components/dashboard/AddWorkoutModal'

// Tipagem baseada no DTO do C#
type LastRun = {
  id: string
  type: string
  distance: number
  duration: string
  pace: string
  date: string
}

type DashboardSummary = {
  totalDistance: number
  totalTime: string
  totalRuns: number
  lastRun: LastRun | null
  weeklyGoalTotal: number
  weeklyGoalDone: number
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Função para buscar dados
  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('run_userid')
    const token = localStorage.getItem('run_token')

    if (!userId) return

    try {
      const res = await fetch(`http://localhost:8081/api/Workout/summary/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSummary(data)
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleAddWorkout = () => {
    setIsModalOpen(true)
  }

  // Calcula porcentagem da meta semanal (limitada a 100% visualmente)
  const goalPercent = summary 
    ? Math.min(100, Math.round((summary.weeklyGoalDone / (summary.weeklyGoalTotal || 1)) * 100))
    : 0

  return (
    <>
      <AddWorkoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDashboardData} // Recarrega os dados ao salvar!
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Principal (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* --- Last Run Card (Dinâmico) --- */}
          <div className="bg-card-bg rounded-xl p-6 @container transition-shadow hover:shadow-lg hover:shadow-primary/10">
            {isLoading ? (
              <div className="animate-pulse flex h-40 items-center justify-center text-text-light">Carregando última atividade...</div>
            ) : summary?.lastRun ? (
              <div className="flex flex-col items-stretch justify-start @xl:flex-row @xl:items-start">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                  // Placeholder de mapa estático (poderia ser dinâmico no futuro)
                  style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?q=80&w=600&auto=format&fit=crop")' }}
                ></div>
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 py-4 @xl:px-6">
                  <p className="text-text-light text-sm font-normal leading-normal">
                    {new Date(summary.lastRun.date).toLocaleDateString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] capitalize">
                    {summary.lastRun.type}
                  </p>
                  <div className="flex items-end gap-3 justify-between mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-lg font-medium leading-normal">
                        {summary.lastRun.distance} km
                      </p>
                      <p className="text-text-light text-base font-normal leading-normal">
                        Distância
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-lg font-medium leading-normal">
                        {summary.lastRun.duration}
                      </p>
                      <p className="text-text-light text-base font-normal leading-normal">
                        Tempo
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-lg font-medium leading-normal">
                        {summary.lastRun.pace}
                      </p>
                      <p className="text-text-light text-base font-normal leading-normal">
                        Pace Médio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <span className="material-symbols-outlined text-4xl text-text-light">directions_run</span>
                <div>
                  <p className="text-white font-medium">Nenhum treino realizado.</p>
                  <p className="text-text-light text-sm">Registre sua primeira atividade para ver os dados aqui!</p>
                </div>
              </div>
            )}
          </div>

          {/* --- This Week's Summary (Dinâmico) --- */}
          <div>
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Resumo Geral (Total)
            </h3>
            <div className="flex flex-wrap gap-4 p-4">
              <StatCard title="Distância Total" value={isLoading ? "..." : `${summary?.totalDistance || 0} km`} />
              <StatCard title="Tempo Total" value={isLoading ? "..." : summary?.totalTime || "0h 0m"} />
              <StatCard title="Treinos" value={isLoading ? "..." : `${summary?.totalRuns || 0}`} />
            </div>
          </div>
        </div>

        {/* Coluna Lateral (1/3) */}
        <div className="space-y-8">
          
          {/* --- CTA Adicionar Treino --- */}
          <div>
            <button
              onClick={handleAddWorkout}
              className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-text-on-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined mr-2">add_circle</span>
              <span className="truncate">Adicionar Treino</span>
            </button>
          </div>
          
          {/* --- Weekly Goal Card (Dinâmico) --- */}
          <div className="bg-card-bg rounded-xl p-6 transition-shadow hover:shadow-lg hover:shadow-primary/10">
            <div className="flex flex-col gap-3">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-white text-base font-medium leading-normal">
                  Meta da Semana
                </p>
                <p className="text-white text-sm font-normal leading-normal">
                  {goalPercent}%
                </p>
              </div>
              <div className="w-full rounded-full bg-progress-bar-bg h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${goalPercent}%` }}
                ></div>
              </div>
              <p className="text-text-light text-sm font-normal leading-normal">
                {summary?.weeklyGoalDone || 0} de {summary?.weeklyGoalTotal || 0} km concluídos
              </p>
            </div>
          </div>

          {/* --- Próximos Treinos (Estático por enquanto ou pode buscar no futuro) --- */}
          <div className="bg-card-bg rounded-xl p-6 transition-shadow hover:shadow-lg hover:shadow-primary/10 opacity-75">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Próximos Treinos
              </h3>
              <span className="text-xs text-text-light bg-background-dark px-2 py-1 rounded">Em Breve</span>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-center justify-between text-sm">
                <p className="text-text-light">Confira seu plano completo na aba Planos.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
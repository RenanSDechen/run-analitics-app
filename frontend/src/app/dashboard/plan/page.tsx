'use client'

import { useState, useEffect } from 'react'
// Note que NÃO estamos importando 'useRouter' or 'useSignupFlow'
import { WeeklyAccordion } from '@/components/signup/WeeklyAccordion'

// --- Tipos de Dados para o Plano ---
// (Reutilizamos os mesmos tipos)
type Workout = {
  day: string
  description: string
}
type WeeklySchedule = {
  weekNumber: number
  workouts: Workout[]
}
type Plan = WeeklySchedule[]

// --- Mock da Resposta da API ---
// (Reutilizamos o mesmo mock. No futuro, isso virá do .NET 8)
const mockGeneratedPlan: Plan = [
  {
    weekNumber: 1,
    workouts: [
      { day: 'Terça', description: 'Treino Intervalado, 12 km, 5:45 min/km' },
      { day: 'Quinta', description: 'Tempo Run, 8 km, 5:30 min/km' },
      { day: 'Domingo', description: 'Longão, 15 km, 6:00 min/km' },
    ],
  },
  {
    weekNumber: 2,
    workouts: [
      { day: 'Terça', description: 'Rodagem Leve, 5 km, 6:30 min/km' },
      { day: 'Quinta', description: 'Treino Intervalado, 10 km, 5:40 min/km' },
      { day: 'Domingo', description: 'Longão, 18 km, 6:00 min/km' },
    ],
  },
]
// --- Fim do Mock ---

// Renomeamos o componente para refletir seu lugar no dashboard
export default function TrainingPlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null) // Estado local

  // Simula o carregamento do plano do usuário quando a página é acessada
  useEffect(() => {
    // No futuro, isso seria:
    // const response = await fetch('/api/user/my-plan')
    // const data = await response.json()
    // setPlan(data)

    // Por agora, usamos o mock com um delay
    const timer = setTimeout(() => {
      setPlan(mockGeneratedPlan)
    }, 500) // 0.5s de delay para simular

    return () => clearTimeout(timer) // Limpa o timer
  }, []) // O array de dependência VAZIO [] significa "rodar apenas uma vez"

  // --- Renderização ---

  // 1. Estado de Carregamento (Adaptado para "Carregando")
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[400px]">
        <span className="material-symbols-outlined text-primary text-6xl animate-spin">
          progress_activity
        </span>
        <p className="text-white text-2xl font-medium mt-4">
          Carregando seu plano...
        </p>
      </div>
    )
  }

  // 2. Estado Carregado (Plano Pronto)
  return (
    // Esta página é renderizada dentro do '/dashboard/layout.tsx',
    // então a navbar já existe.
    <>
      {/* Cabeçalho (Simplificado, sem botões) */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Seu Plano de Treinamento
        </h1>
        {/* Os botões de "Editar" e "Criar Conta" foram REMOVIDOS */}
      </div>

      {/* Lista de Semanas (Accordions) */}
      {/* O componente 'WeeklyAccordion' é 100% reutilizado */}
      <div className="flex flex-col p-4 border-b border-b-form-border">
        {plan.map((week, index) => (
          <WeeklyAccordion
            key={week.weekNumber}
            weekNumber={week.weekNumber}
            workouts={week.workouts}
            defaultOpen={index === 0} // Abre a primeira semana
          />
        ))}
      </div>

    </>
  )
}
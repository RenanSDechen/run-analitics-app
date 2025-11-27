'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSignupFlow } from '@/context/SignupFlowContext'
import { WeeklyAccordion } from '@/components/signup/WeeklyAccordion'
// Reutilizamos o adapter que criamos para o Dashboard!
import { transformLogsToPlan, PlanWeek, ApiLog } from '@/utils/planAdapter' 

export default function SignupPlanPage() {
  const router = useRouter()
  const { flowData } = useSignupFlow() // Dados preenchidos (Sport, Goal, etc)
  
  const [plan, setPlan] = useState<PlanWeek[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        // Monta o DTO que o C# espera (PlanDetailsDto)
        const payload = {
          sport: flowData.sport,
          goal: flowData.goal,
          weeks: flowData.weeksToTrain,
          workoutsPerWeek: flowData.workoutsPerWeek
        }

        // Chama o endpoint PÚBLICO de preview
        const response = await fetch('http://localhost:8081/api/Workout/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) throw new Error('Erro ao gerar prévia')

        const data: ApiLog[] = await response.json()
        
        // Transforma usando o mesmo adapter do dashboard
        const structuredPlan = transformLogsToPlan(data)
        setPlan(structuredPlan)

      } catch (error) {
        console.error(error)
        // Em caso de erro, você pode mostrar um alerta ou fallback
      } finally {
        setIsLoading(false)
      }
    }

    // Só chama se tiver dados (evita chamada vazia)
    if (flowData.sport) {
      fetchPreview()
    }
  }, [flowData])

  // Navegação para o Registro (O "Close" da Venda)
  const handleExport = () => {
    router.push('/signup/register')
  }

  const handleEdit = () => {
    router.push('/signup')
  }

  // --- Renderização ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[400px]">
        <span className="material-symbols-outlined text-primary text-6xl animate-spin">
          network_intelligence
        </span>
        <p className="text-white text-2xl font-medium mt-4">
          A I.A. está montando seu plano...
        </p>
        <p className="text-form-placeholder text-base">
          Personalizando para {flowData.weeksToTrain} semanas de {flowData.sport}...
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Header de Venda */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex flex-col">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Seu Plano Exclusivo
          </p>
          <p className="text-primary text-sm font-bold mt-1">
            BASEADO NAS SUAS METAS
          </p>
        </div>
        <button
          onClick={handleEdit}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-button-secondary-bg text-white text-sm font-bold hover:bg-button-secondary-hover transition-colors"
        >
          Ajustar Preferências
        </button>
      </div>

      {/* O Plano Real (Preview) */}
      <div className="flex flex-col p-4 border-b border-b-form-border">
        {plan?.map((week, index) => (
          <WeeklyAccordion
            key={week.weekNumber}
            weekNumber={week.weekNumber}
            workouts={week.workouts}
            defaultOpen={index === 0} // Abre a primeira semana para engajar
          />
        ))}
      </div>

      {/* O Grande Botão de Conversão */}
      <div className="flex flex-col gap-4 px-4 py-6 justify-center items-center mt-2 bg-card-bg rounded-xl border border-card-border mx-4">
        <p className="text-white text-center font-medium">
          Gostou do que viu? Salve este plano para acompanhar seu progresso.
        </p>
        <button
          onClick={handleExport}
          className="flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-text-on-primary text-lg font-bold hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
        >
          <span className="truncate">Criar Conta e Salvar Plano</span>
        </button>
      </div>
    </>
  )
}
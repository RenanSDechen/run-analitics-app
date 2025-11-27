'use client'

import { useEffect } from 'react' // Adicionado useEffect
import { useRouter } from 'next/navigation'
import { useSignupFlow } from '@/context/SignupFlowContext'
import { ProgressBar } from '@/components/signup/ProgressBar'
import { SportSelector } from '@/components/signup/SportSelector'

// --- 1. DEFINIÇÃO DOS OBJETIVOS (DATA LAYER) ---
// Isso age como seu "Enum" inteligente. 
// As chaves devem bater com os IDs do componente SportSelector.
const SPORT_GOALS: Record<string, { label: string; value: string }[]> = {
  running: [
    { label: 'Completar meus primeiros 5km', value: '5k' },
    { label: 'Correr 10km (Performance)', value: '10k' },
    { label: 'Meia Maratona (21km)', value: 'half_marathon' },
    { label: 'Maratona Completa (42km)', value: 'marathon' },
  ],
  cycling: [
    { label: 'Pedal de 20km (Iniciante)', value: '20km_ride' },
    { label: 'Médio Fondo (50-80km)', value: '50km_ride' },
    { label: 'Gran Fondo (100km+)', value: 'gran_fondo' },
    { label: 'Melhorar FTP / Potência', value: 'improve_ftp' },
  ],
  swimming: [
    { label: 'Nadar 500m sem parar', value: '500m_swim' },
    { label: 'Travessia em Águas Abertas (1.5km)', value: 'open_water' },
    { label: 'Maratona Aquática (3.8km)', value: 'marathon_swim' },
    { label: 'Melhorar Técnica e Respiração', value: 'technique' },
  ],
  triathlon: [
    { label: 'Triathlon Sprint (750m/20km/5km)', value: 'sprint' },
    { label: 'Triathlon Olímpico (1.5km/40km/10km)', value: 'olympic' },
    { label: 'Meio Ironman (70.3)', value: '70.3' },
    { label: 'Ironman Completo (140.6)', value: '140.6' },
  ],
}

export default function SignupStep1() {
  const router = useRouter()
  const { flowData, setFlowData } = useSignupFlow()

  // Filtra os objetivos baseados no esporte selecionado atualmente
  // Se não tiver esporte, retorna array vazio
  const currentGoals = flowData.sport ? SPORT_GOALS[flowData.sport] : []

  // --- 2. EFEITO DE RESET (UX) ---
  // Se o usuário trocar de esporte, limpamos o objetivo anterior
  // para evitar inconsistências (ex: Natação com objetivo de Maratona)
  useEffect(() => {
    setFlowData((prev) => ({ ...prev, goal: '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowData.sport]) 

  const handleSportChange = (sportId: string) => {
    // A atualização do goal é feita pelo useEffect acima
    setFlowData({ ...flowData, sport: sportId })
  }

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFlowData({ ...flowData, goal: e.target.value })
  }

  const handleNextStep = () => {
    if (!flowData.sport || !flowData.goal) {
      alert('Por favor, selecione um esporte e um objetivo.')
      return
    }
    router.push('/signup/step2')
  }

  return (
    <>
      <ProgressBar currentStep={1} totalSteps={3} />
      
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Gere Seu Plano de Treino
        </p>
      </div>

      <h3 className="text-white tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
        Passo 1: Defina Seu Objetivo
      </h3>

      {/* Seletor de Esporte */}
      <SportSelector value={flowData.sport} onChange={handleSportChange} />

      {/* Formulário de Meta Dinâmico */}
      <div className="flex flex-col gap-4 p-4">
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium leading-normal pb-2">
            Selecione Seu Objetivo Principal
          </p>
          
          <div className="relative">
            <select
              value={flowData.goal}
              onChange={handleGoalChange}
              disabled={!flowData.sport} // Desabilita se não escolher esporte
              className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-form-text focus:outline-0 focus:ring-0 border border-form-border bg-form-bg focus:border-primary h-14 bg-right-4 bg-no-repeat appearance-none placeholder:text-form-placeholder p-[15px] text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundImage:
                  "var(--select-button-svg, url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(161,161,170)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e'))",
              }}
            >
              {/* Opção Padrão */}
              <option value="" className="bg-card-bg text-text-light">
                {flowData.sport 
                  ? 'Escolha seu objetivo específico' 
                  : 'Selecione um esporte acima primeiro'}
              </option>

              {/* --- RENDERIZAÇÃO DINÂMICA --- */}
              {currentGoals.map((goal) => (
                <option 
                  key={goal.value} 
                  value={goal.value}
                  className="bg-card-bg text-white"
                >
                  {goal.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      {/* Botão de Navegação */}
      <div className="flex px-4 py-8 justify-center">
        <button
          onClick={handleNextStep}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-primary text-text-on-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          // Desabilita o botão se não tiver tudo preenchido
          disabled={!flowData.sport || !flowData.goal}
        >
          <span className="truncate">Próximo Passo</span>
        </button>
      </div>
    </>
  )
}
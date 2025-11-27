'use client'

import { useRouter } from 'next/navigation'
import { useSignupFlow } from '../../../context/SignupFlowContext'
import { ProgressBar } from '../../../components/signup/ProgressBar'
import { SegmentedControl } from '../../../components/signup/SegmentedControl'

// Opções para o seletor de treinos/semana
const workoutOptions = [
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6+', value: '6+' },
]

export default function SignupStep2() {
  const router = useRouter()
  const { flowData, setFlowData } = useSignupFlow()

  const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowData({
      ...flowData,
      weeksToTrain: Number(e.target.value),
    })
  }

  const handleWorkoutsChange = (value: string) => {
    setFlowData({
      ...flowData,
      workoutsPerWeek: value,
    })
  }

  // Navegação
  const handleBack = () => {
    router.push('/signup') // Volta para o Step 1
  }

  const handleNext = () => {
    router.push('/signup/plan') // Avança para o Step 3 (que faremos a seguir)
  }

  // Calcula a % do slider (Min 4 semanas, Max 40 semanas)
  const sliderPercentage = ((flowData.weeksToTrain - 4) / (40 - 4)) * 100

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* 1. Barra de Progresso (Componente) */}
      <ProgressBar currentStep={2} totalSteps={3} />

      {/* 2. Título */}
      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Gere Seu Plano de Treino
          </p>
          <p className="text-form-placeholder text-base font-normal leading-normal">
            Passo 2: Defina seu Cronograma
          </p>
        </div>
      </div>

      {/* 3. Inputs */}
      <div className="flex flex-col gap-8">
        
        {/* Slider de Semanas (Refatorado para ser um input funcional) */}
        <div className="@container">
          <div className="relative flex w-full flex-col items-start justify-between gap-4 p-4 @[480px]:flex-row @[480px]:items-center">
            <div className="flex w-full shrink-[3] items-center justify-between">
              <p className="text-white text-base font-medium leading-normal">
                Quantas semanas para treinar?
              </p>
              {/* Mostra o valor atual */}
              <p className="text-white text-lg font-bold leading-normal">
                {flowData.weeksToTrain}
              </p>
            </div>
            {/* Input range funcional */}
            <input
              type="range"
              min="4" // Mínimo de 4 semanas
              max="40" // Máximo de 40 semanas
              value={flowData.weeksToTrain}
              onChange={handleWeeksChange}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-progress-bar-bg 
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:h-5
                         [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-primary
                         [&::-webkit-slider-thumb]:border-2
                         [&::-webkit-slider-thumb]:border-background-dark"
            />
          </div>
        </div>

        {/* Seletor de Treinos/Semana (Componente) */}
        <div className="flex flex-col gap-3 px-4">
          <p className="text-white text-base font-medium leading-normal">
            Treinos por semana
          </p>
          <SegmentedControl
            name="workouts-per-week"
            options={workoutOptions}
            value={flowData.workoutsPerWeek}
            onChange={handleWorkoutsChange}
          />
        </div>
      </div>

      {/* 4. Navegação */}
      <div className="flex justify-stretch mt-8">
        <div className="flex flex-1 gap-4 flex-wrap px-4 py-3 justify-end">
          <button
            onClick={handleBack}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-button-secondary-bg text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-button-secondary-hover transition-colors"
          >
            <span className="truncate">Voltar</span>
          </button>
          <button
            onClick={handleNext}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-[#122118] text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">Próximo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
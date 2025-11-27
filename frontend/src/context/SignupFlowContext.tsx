'use client'

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'

// 1. Define o formato dos nossos dados
type SignupFlowData = {
  sport: string
  goal: string
  weeksToTrain: number
  workoutsPerWeek: string
}

// 2. Define o que o Context vai prover
type SignupFlowContextType = {
  flowData: SignupFlowData
  // CORREÇÃO AQUI: Usamos os tipos do React para permitir (prev) => novoEstado
  setFlowData: Dispatch<SetStateAction<SignupFlowData>>
}

// 3. Cria o Context com um valor padrão
const SignupFlowContext = createContext<SignupFlowContextType | undefined>(
  undefined
)

// 4. Cria o "Provider"
export function SignupFlowProvider({ children }: { children: ReactNode }) {
  const [flowData, setFlowData] = useState<SignupFlowData>({
    sport: '',
    goal: '',
    weeksToTrain: 16,     
    workoutsPerWeek: '5', 
  })

  return (
    <SignupFlowContext.Provider value={{ flowData, setFlowData }}>
      {children}
    </SignupFlowContext.Provider>
  )
}

// 5. Hook customizado
export function useSignupFlow() {
  const context = useContext(SignupFlowContext)
  if (context === undefined) {
    throw new Error('useSignupFlow must be used within a SignupFlowProvider')
  }
  return context
}
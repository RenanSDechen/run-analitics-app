'use client'

import { useMemo } from 'react'

type PasswordStrengthMeterProps = {
  password?: string
}

// Objeto para os níveis de força
const STRENGTH_LEVELS = [
  { text: '', color: '' }, // Nível 0 (vazio)
  { text: 'Fraca', color: 'text-red-500' }, // Nível 1
  { text: 'Fraca', color: 'text-red-500' }, // Nível 2
  { text: 'Média', color: 'text-yellow-500' }, // Nível 3
  { text: 'Forte', color: 'text-primary' }, // Nível 4
]

// Barras de cor
const STRENGTH_BAR_COLORS = [
  'bg-red-500',       // Nível 1
  'bg-red-500',       // Nível 2
  'bg-yellow-500',    // Nível 3
  'bg-primary',       // Nível 4
]

// Função para calcular a força (de 0 a 4)
function calculateStrength(password: string): number {
  let score = 0
  if (!password) return score

  // Critérios
  const length = password.length
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password)

  if (length > 0) score = 1;
  if (length >= 8) {
    score = 2
    if (hasNumber || hasSpecial) score = 3
    if (hasNumber && hasSpecial && hasMixedCase) score = 4
  }
  
  return score
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  // useMemo evita o recálculo a cada renderização, 
  // exceto quando a senha muda.
  const strengthScore = useMemo(() => calculateStrength(password), [password])
  const level = STRENGTH_LEVELS[strengthScore]

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* As 4 barras */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, index) => {
          const barColor =
            strengthScore > 0 && index < strengthScore
              ? STRENGTH_BAR_COLORS[strengthScore - 1] // Usa a cor do nível
              : 'bg-form-border' // Cor de fundo (inativa)

          return <div key={index} className={`h-1 flex-1 rounded ${barColor} transition-colors`} />
        })}
      </div>
      
      {/* Texto de Força */}
      {strengthScore > 0 && (
        <p className={`text-xs ${level.color}`}>
          {level.text}
        </p>
      )}
    </div>
  )
}
'use client'

import React from 'react'

// Define os esportes
const SPORTS = [
  { id: 'running', name: 'Running', icon: 'directions_run' },
  { id: 'cycling', name: 'Cycling', icon: 'directions_bike' },
  { id: 'swimming', name: 'Swimming', icon: 'pool' },
  { id: 'triathlon', name: 'Triathlon', icon: 'fitness_center' },
]

// Props: o valor selecionado e a função para alterá-lo
type SportSelectorProps = {
  value: string
  onChange: (sportId: string) => void
}

export function SportSelector({ value, onChange }: SportSelectorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
      {SPORTS.map((sport) => (
        // Usamos <button> para semântica e acessibilidade
        <button
          key={sport.id}
          type="button" // Previne o submit do formulário (que ainda não temos)
          onClick={() => onChange(sport.id)}
          className="flex flex-col gap-3 pb-3 cursor-pointer group rounded-lg focus:outline-none"
        >
          <div
            className={`
              w-full aspect-square bg-form-bg rounded-xl flex items-center justify-center 
              transition-all duration-300 group-hover:bg-primary/20 
              ring-2 
              ${
                value === sport.id
                  ? 'ring-primary' // Estado selecionado
                  : 'ring-transparent' // Estado normal
              }
              group-focus-visible:ring-primary/50 // Foco (acessibilidade)
            `}
          >
            <span className="material-symbols-outlined text-primary text-6xl">
              {sport.icon}
            </span>
          </div>
          <p className="text-white text-base font-medium leading-normal text-center">
            {sport.name}
          </p>
        </button>
      ))}
    </div>
  )
}
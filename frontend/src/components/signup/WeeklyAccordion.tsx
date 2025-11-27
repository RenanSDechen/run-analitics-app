'use client'

// 1. Define o tipo de dados para um treino
type Workout = {
  day: string
  description: string
}

// 2. Define as props do componente
type WeeklyAccordionProps = {
  weekNumber: number
  workouts: Workout[]
  defaultOpen?: boolean // Para abrir a primeira semana por padrão
}

export function WeeklyAccordion({
  weekNumber,
  workouts,
  defaultOpen = false,
}: WeeklyAccordionProps) {
  return (
    <details
      className="flex flex-col border-t border-t-form-border py-2 group"
      // Abre o accordion se defaultOpen for true
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 list-none">
        <p className="text-white text-lg font-medium leading-normal">
          Semana {weekNumber}
        </p>
        <span className="material-symbols-outlined text-white group-open:rotate-180 transition-transform">
          expand_more
        </span>
      </summary>
      
      {/* Conteúdo (Lista de Treinos) */}
      <div className="p-4 grid grid-cols-[25%_1fr] gap-x-6">
        {workouts.map((workout, index) => (
          <div
            key={index}
            className="col-span-2 grid grid-cols-subgrid border-t border-t-form-border py-5"
          >
            <p className="text-form-placeholder text-sm font-normal leading-normal">
              {workout.day}
            </p>
            <p className="text-white text-sm font-normal leading-normal">
              {workout.description}
            </p>
          </div>
        ))}
      </div>
    </details>
  )
}
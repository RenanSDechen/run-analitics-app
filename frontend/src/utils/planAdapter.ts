import { format, differenceInCalendarWeeks, parseISO } from 'date-fns'
// Dica: Se não tiver date-fns, instale: yarn add date-fns
// Ou use lógica nativa se preferir não instalar lib agora (vou fazer nativo abaixo para facilitar)

export type ApiLog = {
  id: string
  date: string
  type: string
  distance: number
  pace: string
  isPlanned: boolean
}

export type PlanWeek = {
  weekNumber: number
  workouts: {
    day: string
    description: string
  }[]
}

export function transformLogsToPlan(logs: ApiLog[]): PlanWeek[] {
  // 1. Filtra apenas os planejados e ordena por data
  const plannedLogs = logs
    .filter((l) => l.isPlanned)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (plannedLogs.length === 0) return []

  const planMap = new Map<number, PlanWeek>()
  const firstDate = new Date(plannedLogs[0].date)

  // 2. Agrupa por semana
  plannedLogs.forEach((log) => {
    const logDate = new Date(log.date)
    
    // Calcula número da semana (0, 1, 2...) baseado na data inicial
    const diffTime = Math.abs(logDate.getTime() - firstDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
    const weekNum = Math.floor(diffDays / 7) + 1

    if (!planMap.has(weekNum)) {
      planMap.set(weekNum, { weekNumber: weekNum, workouts: [] })
    }

    // Formata o dia da semana (ex: "Terça-feira")
    const dayName = logDate.toLocaleDateString('pt-BR', { weekday: 'long' })
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)

    // Formata a descrição
    const description = `${log.type}, ${log.distance}km @ ${log.pace}`

    planMap.get(weekNum)?.workouts.push({
      day: capitalizedDay,
      description: description,
    })
  })

  return Array.from(planMap.values())
}
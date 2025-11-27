'use client'

export type HistoryEntry = {
  id: string
  date: string
  type: string
  distance: number
  pace: string
  actualDistance?: number
  actualPace?: string
  userNotes?: string
  status: number // 0=Pending, 1=Completed, 2=Missed
}

type HistoryItemProps = {
  entry: HistoryEntry
}

function getStatusBadge(entry: HistoryEntry) {
  const workoutDate = new Date(entry.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Zera hora para comparar apenas data

  // 1. Status: Concluído (Prioridade máxima)
  if (entry.status === 1) {
    const plannedDist = entry.distance
    const actualDist = entry.actualDistance || 0

    if (actualDist < plannedDist * 0.8) {
      return { text: 'Parcial', icon: 'data_usage', color: 'text-yellow-500 bg-yellow-500/10', message: 'Volume abaixo do planejado.' }
    }
    if (actualDist > plannedDist * 1.1) {
      return { text: 'Excedente', icon: 'warning', color: 'text-orange-500 bg-orange-500/10', message: 'Volume acima do planejado.' }
    }
    return { text: 'Concluído', icon: 'check_circle', color: 'text-primary bg-primary/10', message: 'Treino executado conforme o plano!' }
  }

  // 2. Status: Futuro (Neutro - Para não gerar ansiedade)
  // Se a data do treino é hoje ou no futuro E ainda não foi feito
  if (workoutDate >= today) {
    return {
      text: 'Planejado',
      icon: 'event', // Ícone de calendário
      color: 'text-blue-400 bg-blue-400/10', // Azul neutro
      message: 'Prepare-se para este treino.',
    }
  }

  // 3. Status: Passado e não feito (Perdido)
  return {
    text: 'Não Realizado',
    icon: 'cancel',
    color: 'text-red-500 bg-red-500/10', // Vermelho alerta
    message: 'Este treino não foi registrado.',
  }
}

export function HistoryItem({ entry }: HistoryItemProps) {
  const feedback = getStatusBadge(entry)
  
  // Formatação de data amigável
  const dateObj = new Date(entry.date)
  const dateString = dateObj.toLocaleDateString('pt-BR', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  })

  // Estilo visual: Se for futuro, deixamos o card um pouco mais "apagado" (opacidade)
  // para dar destaque ao histórico realizado.
  const isFuture = feedback.text === 'Planejado'
  const cardOpacity = isFuture ? 'opacity-80 hover:opacity-100' : 'opacity-100'

  return (
    <div className={`bg-card-bg rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-primary/10 border border-transparent hover:border-form-border ${cardOpacity}`}>
      <div className="flex flex-col @md:flex-row justify-between @md:items-center gap-4 border-b border-card-border pb-4">
        <div>
          <h3 className="text-white text-xl font-bold capitalize">{entry.type}</h3>
          <p className="text-text-light text-sm capitalize flex items-center gap-2">
            {isFuture && <span className="material-symbols-outlined text-sm">event</span>}
            {dateString}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${feedback.color}`}>
          <span className="material-symbols-outlined text-base">{feedback.icon}</span>
          <span className="font-medium text-sm">{feedback.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-3">
          <p className="text-text-light font-medium text-xs uppercase tracking-wider">Meta</p>
          <div className="flex justify-between border-b border-form-border/50 pb-1">
            <span className="text-white text-sm">Distância</span>
            <span className="text-white font-bold">{entry.distance} km</span>
          </div>
          <div className="flex justify-between border-b border-form-border/50 pb-1">
            <span className="text-white text-sm">Pace Alvo</span>
            <span className="text-white font-bold">{entry.pace}</span>
          </div>
        </div>

        {/* Só mostra coluna "Realizado" se não for Futuro */}
        {!isFuture && (
          <div className="space-y-3">
            <p className="text-text-light font-medium text-xs uppercase tracking-wider">Execução</p>
            {entry.status === 1 ? (
              <>
                <div className="flex justify-between border-b border-form-border/50 pb-1">
                  <span className="text-white text-sm">Distância</span>
                  <span className={`font-bold ${entry.actualDistance! >= entry.distance ? 'text-primary' : 'text-white'}`}>
                    {entry.actualDistance} km
                  </span>
                </div>
                <div className="flex justify-between border-b border-form-border/50 pb-1">
                  <span className="text-white text-sm">Pace</span>
                  <span className="text-white font-bold">{entry.actualPace || '--'}</span>
                </div>
              </>
            ) : (
              <p className="text-form-placeholder text-sm italic py-2">--</p>
            )}
          </div>
        )}
      </div>

      {/* Só mostra notas/feedback se NÃO for futuro */}
      {!isFuture && (
        <div className="mt-4 pt-4 flex flex-col gap-2 bg-background-dark/50 -mx-6 -mb-6 p-4 rounded-b-xl border-t border-card-border">
          {entry.userNotes && (
            <div className="flex gap-2 text-sm text-text-light">
              <span className="material-symbols-outlined text-base">edit_note</span>
              <p>"{entry.userNotes}"</p>
            </div>
          )}
          <p className={`text-sm font-medium ${feedback.color.split(' ')[0]}`}>
            {feedback.message}
          </p>
        </div>
      )}
    </div>
  )
}
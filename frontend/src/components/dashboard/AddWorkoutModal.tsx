'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'

type PendingWorkout = {
  id: string
  type: string
  distance: number
  date: string
}

type AddWorkoutModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void // Callback para atualizar a lista pai
}

export function AddWorkoutModal({ isOpen, onClose, onSuccess }: AddWorkoutModalProps) {
  const [pendingWorkouts, setPendingWorkouts] = useState<PendingWorkout[]>([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
  
  // Estados do Formulário
  const [actualDistance, setActualDistance] = useState('')
  const [actualPace, setActualPace] = useState('')
  const [notes, setNotes] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // 1. Busca treinos pendentes ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetchPendingWorkouts()
    }
  }, [isOpen])

  const fetchPendingWorkouts = async () => {
    setIsFetching(true)
    const userId = localStorage.getItem('run_userid')
    const token = localStorage.getItem('run_token')

    try {
      const res = await fetch(`http://localhost:8081/api/Workout/pending/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setPendingWorkouts(data)
      
      // Seleciona o primeiro automaticamente (UX: fecha o mais antigo)
      if (data.length > 0) {
        setSelectedWorkoutId(data[0].id)
        // Preenche sugestão de distância (opcional, ajuda o user)
        setActualDistance(data[0].distance.toString())
      }
    } catch (error) {
      console.error("Erro ao buscar pendentes", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkoutId) return

    setIsLoading(true)
    const token = localStorage.getItem('run_token')

    const payload = {
      actualDistance: parseFloat(actualDistance),
      actualPace: actualPace,
      userNotes: notes
    }

    try {
      const res = await fetch(`http://localhost:8081/api/Workout/complete/${selectedWorkoutId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        onSuccess() // Avisa o pai para recarregar
        onClose()
        // Reset
        setActualDistance('')
        setActualPace('')
        setNotes('')
      }
    } catch (error) {
      console.error("Erro ao salvar", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-card-bg border border-card-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Registrar Conclusão
          </h2>
          <button onClick={onClose} className="text-text-light hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isFetching ? (
          <div className="text-center py-8 text-text-light">Buscando seus treinos...</div>
        ) : pendingWorkouts.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-primary text-4xl mb-2">check_circle</span>
            <p className="text-white font-medium">Você está em dia!</p>
            <p className="text-text-light text-sm">Nenhum treino pendente para hoje ou datas passadas.</p>
            <button onClick={onClose} className="mt-4 text-primary hover:underline">Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Seleção do Treino (Bloqueia futuro, mostra passado/hoje) */}
            <div className="flex flex-col gap-2">
              <Label>Qual treino você realizou?</Label>
              <select
                value={selectedWorkoutId}
                onChange={(e) => setSelectedWorkoutId(e.target.value)}
                className="form-select w-full rounded-xl bg-form-bg border border-form-border text-white h-14 px-4"
              >
                {pendingWorkouts.map(workout => {
                  const date = new Date(workout.date).toLocaleDateString('pt-BR')
                  return (
                    <option key={workout.id} value={workout.id}>
                      {date} - {workout.type} ({workout.distance}km)
                    </option>
                  )
                })}
              </select>
              <p className="text-xs text-yellow-500/80 mt-1">
                * Mostrando apenas treinos de hoje ou atrasados.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Distância Real (km)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={actualDistance}
                  onChange={(e) => setActualDistance(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Pace Real</Label>
                <Input
                  placeholder="Ex: 5:45"
                  value={actualPace}
                  onChange={(e) => setActualPace(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notas / Sensação</Label>
              <Input
                placeholder="Como você se sentiu?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-button-secondary-bg text-white font-bold hover:bg-button-secondary-hover"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl bg-primary text-text-on-primary font-bold hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Salvando...' : 'Concluir Treino'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
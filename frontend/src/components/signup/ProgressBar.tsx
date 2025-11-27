type ProgressBarProps = {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-6 justify-end">
        <p className="text-white text-sm font-normal leading-normal">
          Passo {currentStep} de {totalSteps}
        </p>
      </div>
      <div className="rounded-lg bg-progress-bar-bg">
        <div
          className="h-2 rounded-lg bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
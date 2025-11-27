'use client'

type Option = {
  label: string
  value: string
}

type SegmentedControlProps = {
  name: string
  options: Option[]
  value: string // O valor selecionado (vem do context)
  onChange: (value: string) => void
}

export function SegmentedControl({
  name,
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-radio-group-bg p-1.5">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 
            text-sm font-medium leading-normal transition-colors
            text-radio-group-text 
            has-[:checked]:bg-radio-group-selected-bg has-[:checked]:text-white
          `}
        >
          <span className="truncate">{option.label}</span>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value} // Controla o estado
            onChange={(e) => onChange(e.target.value)}
            className="invisible w-0"
          />
        </label>
      ))}
    </div>
  )
}
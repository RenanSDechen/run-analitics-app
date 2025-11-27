import React from 'react'

type FeatureCardProps = {
  icon: string
  title: string
  children: React.ReactNode
  align?: 'left' | 'center'
}

export function FeatureCard({
  icon,
  title,
  children,
  align = 'left',
}: FeatureCardProps) {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div
      className={`flex flex-1 flex-col gap-3 rounded-xl border border-card-border bg-card-bg p-4 ${alignment}`}
    >
      <span
        className="material-symbols-outlined text-primary"
        style={{ fontSize: 32 }}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="text-white text-base font-bold leading-tight">
          {title}
        </h2>
        <p className="text-card-text-light text-sm font-normal leading-normal">
          {children}
        </p>
      </div>
    </div>
  )
}
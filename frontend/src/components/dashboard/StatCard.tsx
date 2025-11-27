import React from 'react'

type StatCardProps = {
  title: string
  value: string
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card-bg transition-shadow hover:shadow-md hover:shadow-primary/10">
      <p className="text-white text-base font-medium leading-normal">{title}</p>
      <p className="text-primary tracking-light text-3xl font-bold leading-tight">
        {value}
      </p>
    </div>
  )
}
import React from 'react'

type Props = {
  title: string
  value: React.ReactNode
  delta?: string
  spark?: React.ReactNode
}

export const Kpi: React.FC<Props> = ({ title, value, delta, spark }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
        <div>{delta}</div>
        <div>{spark}</div>
      </div>
    </div>
  )
}

export default Kpi

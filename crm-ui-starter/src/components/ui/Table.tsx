import React from 'react'

type Column<T> = {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

type Props<T> = {
  columns: Column<T>[]
  data: T[]
  striped?: boolean
  hoverable?: boolean
}

export const Table = <T,>({ columns, data, striped = true, hoverable = true }: Props<T>) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {columns.map((c) => (
              <th 
                key={c.key} 
                className={`px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider ${alignClass[c.align || 'left']}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className={`transition-colors ${hoverable ? 'hover:bg-primary-light/50 cursor-pointer' : ''} ${striped && idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              {columns.map((c) => (
                <td 
                  key={c.key} 
                  className={`px-6 py-4 text-sm text-gray-700 ${alignClass[c.align || 'left']}`}
                >
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

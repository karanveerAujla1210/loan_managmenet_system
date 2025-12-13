import React from 'react'

type Column<T> = {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  data: T[]
}

export const Table = <T,>({ columns, data }: Props<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#E9EDFF] cursor-pointer">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-sm text-gray-700">{c.render ? c.render(row) : (row as any)[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

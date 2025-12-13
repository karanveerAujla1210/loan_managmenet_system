import React from 'react'

type Item = {
  id: string | number
  title: string
  when?: string
  description?: string
}

type Props = {
  items: Item[]
}

export const Timeline: React.FC<Props> = ({ items }) => {
  return (
    <ol className="relative border-l border-gray-200">
      {items.map((it, idx) => (
        <li key={it.id} className="mb-6 ml-4">
          <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-8 ring-white">
            <span className="block h-2 w-2 rounded-full bg-blue-500" />
          </span>
          <div className="text-sm text-gray-500">{it.when}</div>
          <h4 className="text-base font-semibold text-gray-900">{it.title}</h4>
          {it.description && <p className="text-sm text-gray-600">{it.description}</p>}
        </li>
      ))}
    </ol>
  )
}

export default Timeline

import React from 'react'

export const TopNav: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100">☰</button>
        <div className="text-lg font-semibold">Hello, User</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-64" placeholder="Search..." />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
    </header>
  )
}

export default TopNav

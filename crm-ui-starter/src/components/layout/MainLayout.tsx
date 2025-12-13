import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { Header } from '../Header'

export const MainLayout: React.FC = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-light-gray">
        <Header />
        <main className="content overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

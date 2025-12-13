import React from 'react'

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r p-6 min-h-screen">
      <div className="mb-6">
        <div className="text-2xl font-semibold">Loan CRM</div>
        <div className="text-sm text-gray-500">Business Loans & Relief</div>
      </div>

      <nav className="space-y-2">
        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E9EDFF]">Dashboard</a>
        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E9EDFF]">Customers</a>
        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E9EDFF]">Leads</a>
        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E9EDFF]">Loans</a>
        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E9EDFF]">Collections</a>
        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E9EDFF]">Reports</a>
      </nav>
    </aside>
  )
}

export default Sidebar

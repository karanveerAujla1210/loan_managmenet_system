import React from 'react';

export default function DashboardCards({ metrics }) {
  if (!metrics) return <div className="text-sm">Loading metrics...</div>;

  const cards = [
    { title: 'Customers', value: metrics.totalCustomers },
    { title: 'Active Loans', value: metrics.totalActiveLoans },
    { title: 'Overdue Accounts', value: metrics.totalOverdueAccounts },
    { title: 'Collections Today', value: metrics.totalCollectionsToday },
    { title: 'Monthly Collections', value: metrics.totalMonthlyCollections },
    { title: 'Loan Disbursal Amount', value: metrics.loanDisbursalAmount },
    { title: 'Pending Approvals', value: metrics.pendingApprovals },
    { title: 'NPA Accounts', value: metrics.npaAccounts }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="bg-white shadow rounded p-4">
          <div className="text-xs text-gray-500">{c.title}</div>
          <div className="text-2xl font-semibold">{c.value ?? 0}</div>
        </div>
      ))}
    </div>
  );
}

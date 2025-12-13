import React, { useEffect, useState, useCallback } from 'react';
import DashboardService from '../services/DashboardService';
import DashboardCards from '../components/DashboardCards';
import { LoanPerformanceChart, CollectionsTrendChart, DpdBucketsChart, LeadsChart } from '../components/DashboardCharts';
import { SimpleTable } from '../components/DashboardTables';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loanPerf, setLoanPerf] = useState(null);
  const [collectionsTrend, setCollectionsTrend] = useState(null);
  const [dpdBuckets, setDpdBuckets] = useState(null);
  const [leads, setLeads] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [collections, setCollections] = useState([]);
  const [pending, setPending] = useState({ loans: [], customers: [] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const [m, lp, ct, db, ls, rc, rl, tc, pa, me] = await Promise.all([
        DashboardService.getMetrics(),
        DashboardService.getLoanPerformance(),
        DashboardService.getCollectionsTrend(),
        DashboardService.getDpdBuckets(),
        DashboardService.getLeadsStats(),
        DashboardService.getRecentCustomers(6),
        DashboardService.getRecentLoans(6),
        DashboardService.getTodayCollections(),
        DashboardService.getPendingApprovals(),
        DashboardService.getMe().catch(()=>null)
      ]);

      setMetrics(m);
      setLoanPerf(lp);
      setCollectionsTrend(ct);
      setDpdBuckets(db);
      setLeads(ls);
      setCustomers(rc);
      setLoans(rl);
      setCollections(tc);
      setPending(pa);
      setUser(me);
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 60000);
    return () => clearInterval(id);
  }, [loadAll]);

  // Role mapping: backend may use 'agent'/'admin' => map to requested roles
  const role = (user && (user.role === 'admin' ? 'manager' : user.role === 'agent' ? 'counsellor' : user.role)) || 'guest';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan CRM Dashboard</h1>
        <div className="text-sm text-gray-500">Role: {role}</div>
      </div>

      <DashboardCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <LoanPerformanceChart data={loanPerf} />
          <CollectionsTrendChart data={collectionsTrend} />
        </div>
        <div className="space-y-4">
          <DpdBucketsChart data={dpdBuckets} />
          <LeadsChart data={leads} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        { (role === 'counsellor' || role === 'manager') && (
          <SimpleTable title="Recent Customers" columns={[{ key: 'firstName', title: 'Name', render: r => `${r.firstName} ${r.lastName || ''}` }, { key: 'phone', title: 'Phone' }]} data={customers} />
        )}

        { (role === 'advisor' || role === 'manager') && (
          <SimpleTable title="Recent Loans" columns={[{ key: 'loanId', title: 'Loan ID' }, { key: 'principal', title: 'Amount' }]} data={loans} />
        )}

        <SimpleTable title="Today's Collections" columns={[{ key: 'paymentId', title: 'Txn' }, { key: 'amount', title: 'Amount' }, { key: 'paymentDate', title: 'Date', render: r => new Date(r.paymentDate).toLocaleString() }]} data={collections} />
      </div>

      {role === 'manager' && (
        <div>
          <SimpleTable title="Pending Approvals" columns={[{ key: 'loanId', title: 'Loan ID' }, { key: 'name', title: 'Customer' }]} data={pending.loans || []} />
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Calendar, User, FileText, Loader, Search, Download } from 'lucide-react';
import * as auditService from '../services/audit';

/**
 * AUDIT TRAIL PAGE
 * 
 * View all collections actions with:
 * - Date range filtering
 * - Action type filtering
 * - User filtering
 * - Export to CSV
 * 
 * Shows every action:
 * - Payment recorded
 * - Promise made
 * - Case reassigned
 * - Status changed
 * - Legal escalated
 */

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchAuditLogs();
  }, [startDate, endDate, filterAction, page]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const result = await auditService.getAuditLogsByDateRange(
        startDate,
        endDate,
        {
          action: filterAction !== 'all' ? filterAction : undefined,
          page,
          limit: 50
        }
      );
      setLogs(result.data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const actionLabels = {
    payment_recorded: '💰 Payment Recorded',
    promise_made: '🤝 Promise Made',
    case_reassigned: '👤 Case Reassigned',
    status_changed: '📊 Status Changed',
    legal_escalated: '⚖️ Legal Escalated',
    note_added: '📝 Note Added',
    call_outcome_logged: '📞 Call Logged',
    penalty_applied: '⚠️ Penalty Applied',
    case_closed: '✅ Case Closed'
  };

  const actionColors = {
    payment_recorded: 'bg-green-50 text-green-800',
    promise_made: 'bg-blue-50 text-blue-800',
    case_reassigned: 'bg-purple-50 text-purple-800',
    status_changed: 'bg-orange-50 text-orange-800',
    legal_escalated: 'bg-red-50 text-red-800',
    note_added: 'bg-gray-50 text-gray-800',
    call_outcome_logged: 'bg-cyan-50 text-cyan-800',
    penalty_applied: 'bg-yellow-50 text-yellow-800',
    case_closed: 'bg-gray-50 text-gray-800'
  };

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Time', 'User', 'Role', 'Action', 'Loan ID', 'Amount', 'Remarks'],
      ...logs.map(log => [
        new Date(log.timestamp).toISOString().split('T')[0],
        new Date(log.timestamp).toLocaleTimeString(),
        log.userName || log.userEmail || 'System',
        log.userRole || 'system',
        actionLabels[log.action] || log.action,
        log.loanIdStr || 'N/A',
        log.amount ? `₹${log.amount}` : '',
        log.remarks || ''
      ])
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📋 Audit Trail</h1>
        <p className="text-gray-600 mt-1">Track all collections actions, payments, and status changes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              {Object.entries(actionLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No audit logs found for the selected date range
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{log.userName || log.userEmail || 'System'}</div>
                      <div className="text-xs text-gray-500">{log.userRole}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${actionColors[log.action] || 'bg-gray-50 text-gray-800'}`}>
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.loanIdStr || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      {log.amount ? `₹${log.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.remarks || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page + 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

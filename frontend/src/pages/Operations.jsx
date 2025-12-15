import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import * as loansService from '../services/loans';

export default function Operations() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      setLoading(true);
      const data = await loansService.getLoans();
      // Transform loan data to operations format
      const operationsData = (data?.data || []).map((loan, idx) => ({
        id: idx + 1,
        loanId: loan.loanId,
        task: loan.status === 'pending' ? 'Document Verification' : loan.status === 'approved' ? 'Disbursement Processing' : 'Loan Monitoring',
        customer: loan.customerName || loan.customerId,
        status: loan.status,
        dueDate: loan.disbursementDate || loan.createdAt,
        amount: loan.loanAmount
      }));
      setOperations(operationsData);
    } catch (err) {
      console.error('Error fetching operations:', err);
      setOperations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOps = filter === 'all' 
    ? operations 
    : operations.filter(op => op.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
        <p className="text-gray-600 mt-1">Manage operational tasks and workflows</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'disbursed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Task</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {operationsData.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{task.task}</td>
                <td className="px-6 py-4 text-gray-600">{task.customer}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit space-x-1 ${
                    task.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                    task.status === 'completed' ? 'bg-green-50 text-green-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {task.status === 'pending' && <Clock className="w-3 h-3" />}
                    {task.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                    {task.status === 'in-progress' && <AlertCircle className="w-3 h-3" />}
                    <span>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

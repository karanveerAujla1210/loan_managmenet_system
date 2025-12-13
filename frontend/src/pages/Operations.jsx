import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const operationsData = [
  { id: 1, task: 'Document Verification', customer: 'Rajesh Kumar', status: 'pending', dueDate: '2024-01-15' },
  { id: 2, task: 'Credit Check', customer: 'Priya Singh', status: 'completed', dueDate: '2024-01-10' },
  { id: 3, task: 'Disbursement Processing', customer: 'Amit Patel', status: 'in-progress', dueDate: '2024-01-12' },
];

export default function Operations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
        <p className="text-gray-600 mt-1">Manage operational tasks and workflows</p>
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

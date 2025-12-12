import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overdue = () => {
  const [overdueLoans, setOverdueLoans] = useState([]);

  useEffect(() => {
    fetchOverdueLoans();
  }, []);

  const fetchOverdueLoans = async () => {
    try {
      const response = await axios.get('/api/loans/overdue');
      setOverdueLoans(response.data);
    } catch (error) {
      console.error('Error fetching overdue loans:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Overdue Loans</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {overdueLoans.map((loan) => (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.loanId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.customer?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{loan.overdueAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{loan.daysOverdue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Follow Up</button>
                    <button className="text-green-600 hover:text-green-900">Collect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overdue;
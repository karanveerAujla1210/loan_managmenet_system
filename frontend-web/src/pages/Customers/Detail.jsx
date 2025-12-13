import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCustomer, getCustomerLoans, getCustomerPayments } from '../../services/customers';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: customerRes, isLoading: loadingCustomer, error: customerError } = useQuery(
    ['customer', id],
    () => getCustomer(id),
    { enabled: !!id }
  );

  const { data: loansRes } = useQuery(['customer', id, 'loans'], () => getCustomerLoans(id), { enabled: !!id });
  const { data: paymentsRes } = useQuery(['customer', id, 'payments'], () => getCustomerPayments(id), { enabled: !!id });

  const customer = customerRes?.data;
  const loans = loansRes?.data || [];
  const payments = paymentsRes?.data || [];

  if (loadingCustomer) return <div className="p-6">Loading customer...</div>;
  if (customerError) return <div className="p-6 text-red-600">Failed to load customer</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Customer details</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/customers')}>Back</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{customer?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{customer?.email || '—'}</p>

              <p className="mt-3 text-sm text-gray-600">Phone</p>
              <p className="font-medium">{customer?.phone || '—'}</p>

              <p className="mt-3 text-sm text-gray-600">Address</p>
              <p className="font-medium">{customer?.address || '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">PAN</p>
              <p className="font-medium">{customer?.panCard || '—'}</p>

              <p className="mt-3 text-sm text-gray-600">Aadhaar</p>
              <p className="font-medium">{customer?.aadharCard || '—'}</p>

              <p className="mt-3 text-sm text-gray-600">Status</p>
              <p className="font-medium">{customer?.status || '—'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Loans</h3>
            {loans.length === 0 ? (
              <p className="text-sm text-gray-500">No loans found for this customer.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {loans.map((loan) => (
                  <li key={loan.id} className="p-3 border rounded-md bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium">{loan.accountNumber || loan.id}</div>
                        <div className="text-sm text-gray-500">{loan.productName || loan.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{loan.status}</div>
                        <div className="text-sm text-gray-600">₹{(loan.principal || loan.amount || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Payments</h3>
            {payments.length === 0 ? (
              <p className="text-sm text-gray-500">No payments recorded for this customer.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {payments.map((p) => (
                  <li key={p.id} className="p-3 border rounded-md bg-white">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium">{p.reference || p.id}</div>
                        <div className="text-sm text-gray-500">{p.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">₹{(p.amount || 0).toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{p.status}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetail;

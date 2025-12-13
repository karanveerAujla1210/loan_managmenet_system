import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { getAuditLogs } from '../../services/audit';
import Pagination from '../../components/Pagination';

const AuditLog = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(['audit', { page, search }], () => getAuditLogs({ page, search }));

  if (isLoading) return <div className="p-6">Loading audit logs...</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load audit logs</div>;

  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <div className="w-64">
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search logs..." />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-3 border rounded bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">{log.action}</div>
                    <div className="text-xs text-gray-500">{log.details}</div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>{log.user}</div>
                    <div>{log.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <Pagination pagination={data?.pagination} onPageChange={(p) => setPage(p)} />
      </Card>
    </div>
  );
};

export default AuditLog;

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Database, Server, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { dashboardService } from '../services/dashboard';

const SystemHealthMonitor = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: health, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: dashboardService.getSystemHealth,
    refetchInterval: 10000,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Collapsed View */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-4 w-full text-left hover:bg-gray-50 rounded-lg"
        >
          <div className={`${getStatusColor(health?.database)} flex items-center gap-1`}>
            {getStatusIcon(health?.database)}
            <span className="text-sm font-medium">System Status</span>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${health?.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-xs text-gray-500">
                {health?.database === 'healthy' ? 'Online' : 'Issues'}
              </span>
            </div>
          </div>
        </button>

        {/* Expanded View */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-4 space-y-4 min-w-80">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">System Health</h3>
              <span className="text-xs text-gray-500">
                Last updated: {new Date(health?.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Core Services */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Database</span>
                </div>
                <div className={`flex items-center gap-1 ${getStatusColor(health?.database)}`}>
                  {getStatusIcon(health?.database)}
                  <span className="text-sm capitalize">{health?.database}</span>
                </div>
              </div>

              {health?.services && Object.entries(health.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-600" />
                    <span className="text-sm capitalize">{service}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* System Metrics */}
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium">{formatUptime(health?.uptime || 0)}</span>
              </div>
              
              {health?.memory && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">{formatMemory(health.memory.used)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Total</span>
                    <span className="font-medium">{formatMemory(health.memory.total)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-3 flex gap-2">
              <button className="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
                View Logs
              </button>
              <button className="flex-1 px-3 py-2 text-xs bg-indigo-100 hover:bg-indigo-200 rounded text-indigo-700">
                Diagnostics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthMonitor;

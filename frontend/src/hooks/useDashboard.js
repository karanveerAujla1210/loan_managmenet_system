import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getDashboardActivities } from '../services/dashboard';

export const useDashboard = (filters = {}, options = {}) => {
  // Main dashboard stats
  const {
    data: stats,
    isLoading,
    error,
    refetch,
    isSuccess
  } = useQuery({
    queryKey: ['dashboard-stats', filters],
    queryFn: () => getDashboardStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.enableRealtime ? 30000 : false, // 30 seconds if realtime
  });

  // Recent activities
  const {
    data: activities,
    isLoading: isLoadingActivities
  } = useQuery({
    queryKey: ['dashboard-activities', filters],
    queryFn: () => getDashboardActivities(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: options.enableRealtime !== false,
  });

  // Risk data (loaded conditionally)
  const {
    data: riskData,
    isLoading: isLoadingRisk
  } = useQuery({
    queryKey: ['dashboard-risk', filters],
    queryFn: () => getDashboardStats({ ...filters, includeRisk: true }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: options.loadRiskData === true,
  });

  // Portfolio data (loaded conditionally)
  const {
    data: portfolio,
    isLoading: isLoadingPortfolio
  } = useQuery({
    queryKey: ['dashboard-portfolio', filters],
    queryFn: () => getDashboardStats({ ...filters, includePortfolio: true }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: options.loadPortfolio === true,
  });

  return {
    stats: stats?.data,
    activities: activities?.data || [],
    trends: stats?.trends,
    riskData: riskData?.riskData,
    portfolio: portfolio?.portfolioData,
    isLoading,
    isLoadingActivities,
    isLoadingRisk,
    isLoadingPortfolio,
    error,
    refetch,
    isSuccess
  };
};
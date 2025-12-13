import { useQuery, useQueries } from '@tanstack/react-query';
import { dashboardService, cacheKeys } from '../services/dashboard-optimized';

// Optimized dashboard hook with selective data loading
export const useDashboard = (filters = {}, options = {}) => {
  const { 
    enableRealtime = false, 
    loadRiskData = false, 
    loadPortfolio = false 
  } = options;

  // Core dashboard data (always loaded)
  const statsQuery = useQuery({
    queryKey: cacheKeys.dashboardStats(filters),
    queryFn: () => dashboardService.getDashboardStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: enableRealtime ? 30000 : false,
  });

  // Activities (lightweight)
  const activitiesQuery = useQuery({
    queryKey: cacheKeys.activities(10),
    queryFn: () => dashboardService.getRecentActivities(10),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!statsQuery.data,
  });

  // Optional data (loaded on demand)
  const optionalQueries = useQueries({
    queries: [
      {
        queryKey: cacheKeys.trends('6m'),
        queryFn: () => dashboardService.getCollectionTrends('6m'),
        staleTime: 10 * 60 * 1000,
        enabled: !!statsQuery.data,
      },
      {
        queryKey: cacheKeys.portfolio(),
        queryFn: () => dashboardService.getLoanPortfolio(),
        staleTime: 15 * 60 * 1000,
        enabled: loadPortfolio && !!statsQuery.data,
      },
      {
        queryKey: cacheKeys.riskAnalytics(),
        queryFn: () => dashboardService.getRiskAnalytics(),
        staleTime: 10 * 60 * 1000,
        enabled: loadRiskData && !!statsQuery.data,
      }
    ]
  });

  const [trendsQuery, portfolioQuery, riskQuery] = optionalQueries;

  return {
    stats: statsQuery.data,
    activities: activitiesQuery.data,
    trends: trendsQuery?.data,
    portfolio: portfolioQuery?.data,
    riskData: riskQuery?.data,
    
    // Loading states
    isLoading: statsQuery.isLoading,
    isLoadingActivities: activitiesQuery.isLoading,
    isLoadingTrends: trendsQuery?.isLoading,
    isLoadingPortfolio: portfolioQuery?.isLoading,
    isLoadingRisk: riskQuery?.isLoading,
    
    // Error states
    error: statsQuery.error || activitiesQuery.error,
    
    // Refetch functions
    refetch: () => {
      statsQuery.refetch();
      activitiesQuery.refetch();
      trendsQuery?.refetch();
      portfolioQuery?.refetch();
      riskQuery?.refetch();
    },
    
    // Status
    isSuccess: statsQuery.isSuccess && activitiesQuery.isSuccess,
  };
};

// Lightweight system health hook
export const useSystemHealth = () => {
  return useQuery({
    queryKey: cacheKeys.systemHealth(),
    queryFn: dashboardService.getSystemHealth,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
    retry: 1,
  });
};
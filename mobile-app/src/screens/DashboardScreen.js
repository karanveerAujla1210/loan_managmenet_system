import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loanService } from '../services/api';
import { useDatabase } from '../contexts/DatabaseContext';
import SyncService from '../services/syncService';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    dueToday: 0,
    overdue: 0,
    pendingSync: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const { db } = useDatabase();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load online data
      const [dueTodayRes, overdueRes] = await Promise.all([
        loanService.getDueToday(),
        loanService.getOverdue(),
      ]);

      // Load offline sync count
      let pendingSync = 0;
      if (db) {
        const syncService = new SyncService(db);
        const syncCount = await syncService.getPendingSyncCount();
        pendingSync = syncCount.total;
      }

      setStats({
        dueToday: dueTodayRes.data.length,
        overdue: overdueRes.data.length,
        pendingSync,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, color, icon, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Collections Dashboard</Text>
        <Text style={styles.subtitle}>Field Agent Portal</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          color="#f59e0b"
          icon="calendar"
          onPress={() => navigation.navigate('Loans', { filter: 'due-today' })}
        />
        
        <StatCard
          title="Overdue Loans"
          value={stats.overdue}
          color="#ef4444"
          icon="alert-circle"
          onPress={() => navigation.navigate('Loans', { filter: 'overdue' })}
        />
        
        <StatCard
          title="Pending Sync"
          value={stats.pendingSync}
          color="#8b5cf6"
          icon="sync"
          onPress={() => navigation.navigate('Sync')}
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Loans')}
        >
          <Ionicons name="list" size={20} color="#3b82f6" />
          <Text style={styles.actionText}>View All Loans</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Sync')}
        >
          <Ionicons name="sync" size={20} color="#10b981" />
          <Text style={styles.actionText}>Sync Data</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    fontWeight: '500',
  },
});
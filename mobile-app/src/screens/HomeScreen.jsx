import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { getAgentLoans } from '../services/collectionService';
import syncManager from '../sync/syncManager';
import dayjs from 'dayjs';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({
    dueToday: 0,
    overdue: 0,
    total: 0
  });
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadSyncStatus();
  }, []);

  const loadDashboardData = async () => {
    try {
      const agentId = 'current_agent'; // Get from auth context
      
      const [dueTodayLoans, overdueLoans, allLoans] = await Promise.all([
        getAgentLoans(agentId, 'due_today'),
        getAgentLoans(agentId, 'overdue'),
        getAgentLoans(agentId, 'all')
      ]);

      setStats({
        dueToday: dueTodayLoans.length,
        overdue: overdueLoans.length,
        total: allLoans.length
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const loadSyncStatus = async () => {
    try {
      const status = await syncManager.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const handleSync = async () => {
    try {
      await syncManager.startSync();
      loadSyncStatus();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Dashboard</Title>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Today's Collections</Title>
            <Paragraph>Due Today: {stats.dueToday}</Paragraph>
            <Paragraph>Overdue: {stats.overdue}</Paragraph>
            <Paragraph>Total Assigned: {stats.total}</Paragraph>
          </Card.Content>
        </Card>

        {syncStatus && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Sync Status</Title>
              <Paragraph>Pending: {syncStatus.pending}</Paragraph>
              <Paragraph>Failed: {syncStatus.failed}</Paragraph>
              <Paragraph>Completed: {syncStatus.completed}</Paragraph>
              <Button 
                mode="outlined" 
                onPress={handleSync}
                style={styles.syncButton}
              >
                Sync Now
              </Button>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Queue', { filter: 'due_today' })}
              style={styles.actionButton}
            >
              View Due Today
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Queue', { filter: 'overdue' })}
              style={styles.actionButton}
            >
              View Overdue
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('SyncStatus')}
              style={styles.actionButton}
            >
              Sync Status
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="refresh"
        onPress={loadDashboardData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  title: {
    padding: 20,
    fontSize: 24
  },
  card: {
    margin: 10,
    marginBottom: 15
  },
  actionButton: {
    marginTop: 10
  },
  syncButton: {
    marginTop: 10
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
});
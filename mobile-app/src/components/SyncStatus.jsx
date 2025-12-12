import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';
import db from '../db/schema';
import syncManager from '../sync/syncManager';
import dayjs from 'dayjs';

export default function SyncStatus({ navigation }) {
  const [queueItems, setQueueItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSyncData();
  }, []);

  const loadSyncData = async () => {
    try {
      const [statsData, queueData] = await Promise.all([
        syncManager.getSyncStatus(),
        getSyncQueueItems()
      ]);
      
      setStats(statsData);
      setQueueItems(queueData);
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  };

  const getSyncQueueItems = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM sync_queue 
           ORDER BY 
             CASE status 
               WHEN 'failed' THEN 1 
               WHEN 'pending' THEN 2 
               ELSE 3 
             END,
             created_at DESC 
           LIMIT 50`,
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      await syncManager.startSync();
      await loadSyncData();
      Alert.alert('Success', 'Sync completed');
    } catch (error) {
      Alert.alert('Error', 'Sync failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCompleted = () => {
    Alert.alert(
      'Clear Completed',
      'Remove all completed sync items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: () => clearCompletedItems()
        }
      ]
    );
  };

  const clearCompletedItems = () => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM sync_queue WHERE status = 'completed'`,
        [],
        () => {
          loadSyncData();
          Alert.alert('Success', 'Completed items cleared');
        },
        (_, error) => {
          Alert.alert('Error', 'Failed to clear items: ' + error.message);
        }
      );
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'failed': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const renderQueueItem = ({ item }) => (
    <Card style={styles.queueCard}>
      <Card.Content>
        <View style={styles.queueHeader}>
          <Title style={styles.queueTitle}>{item.type.toUpperCase()}</Title>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={{ color: 'white' }}
          >
            {item.status}
          </Chip>
        </View>
        
        <Paragraph>Attempts: {item.attempts}</Paragraph>
        <Paragraph>Created: {dayjs(item.created_at).format('DD MMM YYYY HH:mm')}</Paragraph>
        
        {item.last_attempt_at && (
          <Paragraph>Last Attempt: {dayjs(item.last_attempt_at).format('DD MMM YYYY HH:mm')}</Paragraph>
        )}
        
        {item.error_message && (
          <Paragraph style={styles.errorText}>Error: {item.error_message}</Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Sync Statistics</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.pending || 0}</Paragraph>
              <Paragraph>Pending</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.failed || 0}</Paragraph>
              <Paragraph>Failed</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.completed || 0}</Paragraph>
              <Paragraph>Completed</Paragraph>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              onPress={handleSync}
              loading={loading}
              disabled={loading}
              style={styles.actionButton}
            >
              Sync Now
            </Button>
            <Button 
              mode="outlined" 
              onPress={handleClearCompleted}
              style={styles.actionButton}
            >
              Clear Completed
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Queue Items */}
      <FlatList
        data={queueItems}
        renderItem={renderQueueItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        onRefresh={loadSyncData}
        refreshing={false}
      />

      <FAB
        style={styles.fab}
        icon="refresh"
        onPress={loadSyncData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  statsCard: {
    margin: 10,
    marginBottom: 15
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5
  },
  listContainer: {
    padding: 10
  },
  queueCard: {
    marginBottom: 10
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  queueTitle: {
    fontSize: 16,
    flex: 1
  },
  statusChip: {
    marginLeft: 10
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
});
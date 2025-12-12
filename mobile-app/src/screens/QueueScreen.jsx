import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip, Button, Searchbar } from 'react-native-paper';
import { getAgentLoans } from '../services/collectionService';
import dayjs from 'dayjs';

export default function QueueScreen({ navigation, route }) {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filter, setFilter] = useState(route.params?.filter || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLoans();
  }, [filter]);

  useEffect(() => {
    filterLoans();
  }, [loans, searchQuery]);

  const loadLoans = async () => {
    try {
      const agentId = 'current_agent'; // Get from auth context
      const loanData = await getAgentLoans(agentId, filter);
      setLoans(loanData);
    } catch (error) {
      console.error('Failed to load loans:', error);
    }
  };

  const filterLoans = () => {
    if (!searchQuery) {
      setFilteredLoans(loans);
      return;
    }

    const filtered = loans.filter(loan => 
      loan.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.loan_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLoans(filtered);
  };

  const getStatusColor = (loan) => {
    const dueDate = dayjs(loan.next_due_date);
    const today = dayjs();
    
    if (dueDate.isBefore(today, 'day')) return '#f44336'; // Red for overdue
    if (dueDate.isSame(today, 'day')) return '#ff9800'; // Orange for due today
    return '#4caf50'; // Green for future
  };

  const renderLoanItem = ({ item }) => (
    <Card style={styles.loanCard} onPress={() => navigation.navigate('LoanDetail', { loanId: item.loan_id })}>
      <Card.Content>
        <View style={styles.loanHeader}>
          <Title style={styles.loanTitle}>{item.customer_name}</Title>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item) }]}
            textStyle={{ color: 'white' }}
          >
            ₹{item.outstanding_amount}
          </Chip>
        </View>
        
        <Paragraph>Loan ID: {item.loan_id}</Paragraph>
        <Paragraph>DPD: {item.dpd} days</Paragraph>
        <Paragraph>Due Date: {dayjs(item.next_due_date).format('DD MMM YYYY')}</Paragraph>
        
        <View style={styles.actionButtons}>
          <Button 
            mode="contained" 
            compact
            onPress={() => navigation.navigate('PaymentForm', { loanId: item.loan_id })}
            style={styles.actionButton}
          >
            Collect
          </Button>
          <Button 
            mode="outlined" 
            compact
            onPress={() => navigation.navigate('PTPForm', { loanId: item.loan_id })}
            style={styles.actionButton}
          >
            PTP
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search loans..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filterButtons}>
        <Button 
          mode={filter === 'all' ? 'contained' : 'outlined'}
          onPress={() => setFilter('all')}
          compact
        >
          All
        </Button>
        <Button 
          mode={filter === 'due_today' ? 'contained' : 'outlined'}
          onPress={() => setFilter('due_today')}
          compact
        >
          Due Today
        </Button>
        <Button 
          mode={filter === 'overdue' ? 'contained' : 'outlined'}
          onPress={() => setFilter('overdue')}
          compact
        >
          Overdue
        </Button>
      </View>

      <FlatList
        data={filteredLoans}
        renderItem={renderLoanItem}
        keyExtractor={(item) => item.loan_id}
        contentContainerStyle={styles.listContainer}
        onRefresh={loadLoans}
        refreshing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchbar: {
    margin: 10
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  listContainer: {
    padding: 10
  },
  loanCard: {
    marginBottom: 10
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  loanTitle: {
    fontSize: 18,
    flex: 1
  },
  statusChip: {
    marginLeft: 10
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5
  }
});
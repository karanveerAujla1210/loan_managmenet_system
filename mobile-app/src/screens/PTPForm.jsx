import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { recordPTP } from '../services/collectionService';
import dayjs from 'dayjs';

export default function PTPForm({ navigation, route }) {
  const { loanId } = route.params;
  const [promiseDate, setPromiseDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!promiseDate) {
      Alert.alert('Error', 'Please select a promise date');
      return;
    }

    const selectedDate = dayjs(promiseDate);
    if (selectedDate.isBefore(dayjs(), 'day')) {
      Alert.alert('Error', 'Promise date cannot be in the past');
      return;
    }

    setLoading(true);

    try {
      const ptpData = {
        promiseDate: selectedDate.toISOString(),
        amount: parseFloat(amount),
        note
      };

      const agentId = 'current_agent'; // Get from auth context
      await recordPTP(loanId, ptpData, agentId);

      Alert.alert(
        'Success', 
        'Promise to Pay recorded successfully. It will be synced when network is available.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to record PTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Promise to Pay</Title>
          
          <TextInput
            label="Promise Date (YYYY-MM-DD)"
            value={promiseDate}
            onChangeText={setPromiseDate}
            mode="outlined"
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />

          <TextInput
            label="Amount (₹)"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Note (Optional)"
            value={note}
            onChangeText={setNote}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Customer's commitment details..."
          />

          <View style={styles.submitButtons}>
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={styles.submitButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Record PTP
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15
  },
  card: {
    marginTop: 20
  },
  input: {
    marginBottom: 15
  },
  submitButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 5
  }
});
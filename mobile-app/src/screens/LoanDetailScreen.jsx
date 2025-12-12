import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider } from 'react-native-paper';
import { getLoanDetails } from '../services/collectionService';
import dayjs from 'dayjs';

export default function LoanDetailScreen({ navigation, route }) {
  const { loanId } = route.params;
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoanDetails();
  }, []);

  const loadLoanDetails = async () => {
    try {
      const loanData = await getLoanDetails(loanId);
      setLoan(loanData);
    } catch (error) {
      console.error('Failed to load loan details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !loan) {
    return <View style={styles.container}><Paragraph>Loading...</Paragraph></View>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#4caf50';
      case 'partial': return '#ff9800';
      case 'queued': return '#2196f3';
      case 'synced': return '#4caf50';
      case 'failed': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Loan Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>{loan.customer_name}</Title>
          <Paragraph>Loan ID: {loan.loan_id}</Paragraph>
          <Paragraph>Phone: {loan.customer_phone}</Paragraph>
          <Paragraph>Principal: ₹{loan.principal}</Paragraph>
          <Paragraph>Outstanding: ₹{loan.outstanding_amount}</Paragraph>
          <Paragraph>DPD: {loan.dpd} days</Paragraph>
          <Paragraph>Next Due: {dayjs(loan.next_due_date).format('DD MMM YYYY')}</Paragraph>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Actions</Title>
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('PaymentForm', { loanId })}
              style={styles.actionButton}
            >
              Record Payment
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('PTPForm', { loanId })}
              style={styles.actionButton}
            >
              Promise to Pay
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Payment Schedule */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Payment Schedule</Title>
          {loan.schedule?.map((inst, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleHeader}>
                <Paragraph>Installment {inst.inst_no}</Paragraph>
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(inst.status) }]}
                  textStyle={{ color: 'white' }}
                >
                  {inst.status}
                </Chip>
              </View>
              <Paragraph>Due: {dayjs(inst.due_date).format('DD MMM YYYY')}</Paragraph>
              <Paragraph>Amount: ₹{inst.amount} | Paid: ₹{inst.paid_amount}</Paragraph>
              {index < loan.schedule.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Recent Payments */}
      {loan.payments?.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Payments</Title>
            {loan.payments.slice(0, 5).map((payment, index) => (
              <View key={index} style={styles.paymentItem}>
                <View style={styles.paymentHeader}>
                  <Paragraph>₹{payment.amount}</Paragraph>
                  <Chip 
                    style={[styles.statusChip, { backgroundColor: getStatusColor(payment.status) }]}
                    textStyle={{ color: 'white' }}
                  >
                    {payment.status}
                  </Chip>
                </View>
                <Paragraph>Date: {dayjs(payment.date).format('DD MMM YYYY')}</Paragraph>
                <Paragraph>Mode: {payment.mode}</Paragraph>
                {payment.notes && <Paragraph>Notes: {payment.notes}</Paragraph>}
                {index < Math.min(loan.payments.length, 5) - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* PTPs */}
      {loan.ptps?.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Promises to Pay</Title>
            {loan.ptps.slice(0, 3).map((ptp, index) => (
              <View key={index} style={styles.ptpItem}>
                <View style={styles.ptpHeader}>
                  <Paragraph>₹{ptp.amount}</Paragraph>
                  <Chip 
                    style={[styles.statusChip, { backgroundColor: getStatusColor(ptp.status) }]}
                    textStyle={{ color: 'white' }}
                  >
                    {ptp.status}
                  </Chip>
                </View>
                <Paragraph>Promise Date: {dayjs(ptp.promise_date).format('DD MMM YYYY')}</Paragraph>
                {ptp.note && <Paragraph>Note: {ptp.note}</Paragraph>}
                {index < Math.min(loan.ptps.length, 3) - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Notes */}
      {loan.notes?.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notes</Title>
            {loan.notes.slice(0, 3).map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Paragraph>{note.text}</Paragraph>
                <Paragraph style={styles.noteTimestamp}>
                  {dayjs(note.timestamp).format('DD MMM YYYY HH:mm')}
                </Paragraph>
                {index < Math.min(loan.notes.length, 3) - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  card: {
    margin: 10,
    marginBottom: 15
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
  scheduleItem: {
    marginVertical: 5
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paymentItem: {
    marginVertical: 5
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ptpItem: {
    marginVertical: 5
  },
  ptpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noteItem: {
    marginVertical: 5
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  statusChip: {
    marginLeft: 10
  },
  divider: {
    marginVertical: 10
  }
});
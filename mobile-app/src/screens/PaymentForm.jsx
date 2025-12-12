import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Card, RadioButton, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { recordPayment } from '../services/collectionService';
import dayjs from 'dayjs';

export default function PaymentForm({ navigation, route }) {
  const { loanId } = route.params;
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('cash');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const paymentModes = [
    { label: 'Cash', value: 'cash' },
    { label: 'Cheque', value: 'cheque' },
    { label: 'Online Transfer', value: 'online' },
    { label: 'UPI', value: 'upi' }
  ];

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0]);
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        amount: parseFloat(amount),
        mode,
        notes,
        attachmentPath: attachment?.uri,
        date: dayjs().toISOString()
      };

      const agentId = 'current_agent'; // Get from auth context
      await recordPayment(loanId, paymentData, agentId);

      Alert.alert(
        'Success', 
        'Payment recorded successfully. It will be synced when network is available.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to record payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Record Payment</Title>
          
          <TextInput
            label="Amount (₹)"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Payment Mode</Text>
          <RadioButton.Group onValueChange={setMode} value={mode}>
            {paymentModes.map((paymentMode) => (
              <View key={paymentMode.value} style={styles.radioItem}>
                <RadioButton value={paymentMode.value} />
                <Text style={styles.radioLabel}>{paymentMode.label}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.sectionTitle}>Attachment</Text>
          <View style={styles.attachmentButtons}>
            <Button 
              mode="outlined" 
              onPress={handleCamera}
              style={styles.attachmentButton}
              icon="camera"
            >
              Camera
            </Button>
            <Button 
              mode="outlined" 
              onPress={handleImagePicker}
              style={styles.attachmentButton}
              icon="image"
            >
              Gallery
            </Button>
          </View>

          {attachment && (
            <Text style={styles.attachmentText}>
              Attachment: {attachment.fileName || 'Image selected'}
            </Text>
          )}

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
              Record Payment
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  card: {
    margin: 15
  },
  input: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16
  },
  attachmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  attachmentButton: {
    flex: 1,
    marginHorizontal: 5
  },
  attachmentText: {
    marginBottom: 15,
    fontStyle: 'italic',
    color: '#666'
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
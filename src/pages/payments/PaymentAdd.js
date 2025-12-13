import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Typography, Card, CardContent, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert
} from '@mui/material';

function PaymentAdd() {
  const location = useLocation();
  const [payment, setPayment] = useState({
    loanId: location.state?.loanId || '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    mode: '',
    utrRef: '',
    bank: '',
    remarks: ''
  });

  const [allocation, setAllocation] = useState({
    penalty: 500,
    interest: 4500,
    principal: 0,
    advance: 0
  });

  const [showAllocation, setShowAllocation] = useState(false);

  const handleAmountChange = (amount) => {
    setPayment({...payment, amount});
    
    // Auto-allocation logic
    let remaining = parseFloat(amount) || 0;
    const newAllocation = { penalty: 0, interest: 0, principal: 0, advance: 0 };
    
    // Allocate to penalty first
    const penaltyDue = 500;
    newAllocation.penalty = Math.min(remaining, penaltyDue);
    remaining -= newAllocation.penalty;
    
    // Then to interest
    const interestDue = 4500;
    newAllocation.interest = Math.min(remaining, interestDue);
    remaining -= newAllocation.interest;
    
    // Then to principal
    const principalDue = 40000;
    newAllocation.principal = Math.min(remaining, principalDue);
    remaining -= newAllocation.principal;
    
    // Remaining as advance
    newAllocation.advance = remaining;
    
    setAllocation(newAllocation);
    setShowAllocation(amount > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment
    alert('Payment processed successfully!');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Add Payment</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Details</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Loan ID"
                      value={payment.loanId}
                      onChange={(e) => setPayment({...payment, loanId: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={payment.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Date"
                      type="date"
                      value={payment.paymentDate}
                      onChange={(e) => setPayment({...payment, paymentDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Payment Mode</InputLabel>
                      <Select
                        value={payment.mode}
                        onChange={(e) => setPayment({...payment, mode: e.target.value})}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Cheque">Cheque</MenuItem>
                        <MenuItem value="NEFT">NEFT</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="RTGS">RTGS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="UTR/Reference Number"
                      value={payment.utrRef}
                      onChange={(e) => setPayment({...payment, utrRef: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bank"
                      value={payment.bank}
                      onChange={(e) => setPayment({...payment, bank: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      multiline
                      rows={3}
                      value={payment.remarks}
                      onChange={(e) => setPayment({...payment, remarks: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
                      Process Payment
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {showAllocation && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Auto-Allocation Preview</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Payment will be allocated in the following order: Penalty → Interest → Principal → Advance
                </Alert>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Due Amount</TableCell>
                      <TableCell>Allocated</TableCell>
                      <TableCell>Remaining</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Penalty</TableCell>
                      <TableCell>₹500</TableCell>
                      <TableCell>₹{allocation.penalty}</TableCell>
                      <TableCell>₹{500 - allocation.penalty}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Interest</TableCell>
                      <TableCell>₹4,500</TableCell>
                      <TableCell>₹{allocation.interest}</TableCell>
                      <TableCell>₹{4500 - allocation.interest}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Principal</TableCell>
                      <TableCell>₹40,000</TableCell>
                      <TableCell>₹{allocation.principal}</TableCell>
                      <TableCell>₹{40000 - allocation.principal}</TableCell>
                    </TableRow>
                    {allocation.advance > 0 && (
                      <TableRow>
                        <TableCell>Advance Principal</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>₹{allocation.advance}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default PaymentAdd;
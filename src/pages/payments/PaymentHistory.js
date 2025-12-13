import React, { useState } from 'react';
import {
  Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Grid, Button, Chip
} from '@mui/material';

function PaymentHistory() {
  const [filters, setFilters] = useState({
    loanId: '',
    dateFrom: '',
    dateTo: ''
  });

  const paymentHistory = [
    {
      id: 1,
      date: '2024-01-15',
      loanId: 'LN001',
      customerName: 'NITIN CHAURASIA',
      amount: 5000,
      mode: 'UPI',
      utr: 'UPI123456789',
      status: 'Success',
      allocation: { penalty: 500, interest: 4500, principal: 0 }
    },
    {
      id: 2,
      date: '2024-01-14',
      loanId: 'LN002',
      customerName: 'PAWAN KESARWANI',
      amount: 4000,
      mode: 'NEFT',
      utr: 'NEFT987654321',
      status: 'Success',
      allocation: { penalty: 0, interest: 4000, principal: 0 }
    }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Payment History</Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Loan ID"
                value={filters.loanId}
                onChange={(e) => setFilters({...filters, loanId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" fullWidth sx={{ height: '56px' }}>
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Payment Records ({paymentHistory.length})</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Loan ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>UTR/Ref</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Allocation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.loanId}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.mode}</TableCell>
                  <TableCell>{payment.utr}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status} 
                      color={payment.status === 'Success' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      {payment.allocation.penalty > 0 && <div>Penalty: ₹{payment.allocation.penalty}</div>}
                      {payment.allocation.interest > 0 && <div>Interest: ₹{payment.allocation.interest}</div>}
                      {payment.allocation.principal > 0 && <div>Principal: ₹{payment.allocation.principal}</div>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentHistory;
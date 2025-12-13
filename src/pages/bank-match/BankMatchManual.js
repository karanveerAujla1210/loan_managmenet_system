import React, { useState } from 'react';
import {
  Typography, Card, CardContent, Grid, TextField, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, Alert
} from '@mui/material';

function BankMatchManual() {
  const [searchCriteria, setSearchCriteria] = useState({
    amount: '',
    dateFrom: '',
    dateTo: '',
    utr: '',
    customerName: ''
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const unmatchedTransactions = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 4750,
      utr: 'UPI999888777',
      description: 'IMPS Transfer',
      remitterName: 'NITIN KUMAR'
    },
    {
      id: 2,
      date: '2024-01-14',
      amount: 3200,
      utr: 'NEFT555444333',
      description: 'NEFT Transfer',
      remitterName: 'PAWAN SINGH'
    }
  ];

  const searchResults = [
    {
      loanId: 'LN001',
      customerName: 'NITIN CHAURASIA',
      phone: '7408317957',
      dueAmount: 5000,
      lastPayment: '2023-12-15',
      dpd: 15
    },
    {
      loanId: 'LN002',
      customerName: 'PAWAN KESARWANI',
      phone: '9811424580',
      dueAmount: 4000,
      lastPayment: '2023-11-20',
      dpd: 45
    }
  ];

  const handleMatch = () => {
    if (selectedTransaction && selectedLoan) {
      alert(`Matched transaction ${selectedTransaction.id} with loan ${selectedLoan.loanId}`);
      setSelectedTransaction(null);
      setSelectedLoan(null);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Manual Bank Match</Typography>
      
      <Grid container spacing={3}>
        {/* Search Criteria */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Search Criteria</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={searchCriteria.amount}
                    onChange={(e) => setSearchCriteria({...searchCriteria, amount: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="From Date"
                    type="date"
                    value={searchCriteria.dateFrom}
                    onChange={(e) => setSearchCriteria({...searchCriteria, dateFrom: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="To Date"
                    type="date"
                    value={searchCriteria.dateTo}
                    onChange={(e) => setSearchCriteria({...searchCriteria, dateTo: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="UTR/Reference"
                    value={searchCriteria.utr}
                    onChange={(e) => setSearchCriteria({...searchCriteria, utr: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={searchCriteria.customerName}
                    onChange={(e) => setSearchCriteria({...searchCriteria, customerName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button variant="contained" fullWidth sx={{ height: '56px' }}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Unmatched Transactions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Unmatched Transactions</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>UTR</TableCell>
                    <TableCell>Remitter</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unmatchedTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      selected={selectedTransaction?.id === transaction.id}
                    >
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>{transaction.utr}</TableCell>
                      <TableCell>{transaction.remitterName}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant={selectedTransaction?.id === transaction.id ? "contained" : "outlined"}
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Loan Search Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Loan Search Results</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loan ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Due Amount</TableCell>
                    <TableCell>DPD</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((loan) => (
                    <TableRow 
                      key={loan.loanId}
                      selected={selectedLoan?.loanId === loan.loanId}
                    >
                      <TableCell>{loan.loanId}</TableCell>
                      <TableCell>{loan.customerName}</TableCell>
                      <TableCell>₹{loan.dueAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${loan.dpd} days`} 
                          color={loan.dpd > 30 ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant={selectedLoan?.loanId === loan.loanId ? "contained" : "outlined"}
                          onClick={() => setSelectedLoan(loan)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Match Action */}
        {selectedTransaction && selectedLoan && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="h6">Ready to Match</Typography>
              <Typography>
                Transaction: ₹{selectedTransaction.amount.toLocaleString()} ({selectedTransaction.utr}) 
                → Loan: {selectedLoan.loanId} - {selectedLoan.customerName}
              </Typography>
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleMatch}
                sx={{ mt: 2 }}
              >
                Confirm Match
              </Button>
            </Alert>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default BankMatchManual;
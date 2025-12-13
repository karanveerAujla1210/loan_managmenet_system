import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Divider, List, ListItem, ListItemText
} from '@mui/material';

function LoanSummary() {
  const { loanId } = useParams();

  const loanData = {
    loanId: 'LN001',
    customer: {
      name: 'NITIN CHAURASIA',
      phone: '7408317957',
      email: 'nitin@example.com',
      address: 'Mumbai, Maharashtra'
    },
    loanDetails: {
      amount: 100000,
      tenure: 24,
      interestRate: 12.5,
      disbursementDate: '2023-01-15',
      maturityDate: '2025-01-15',
      currentOutstanding: 45000,
      principalOutstanding: 40000,
      interestOutstanding: 4500,
      penaltyOutstanding: 500
    },
    collectionInfo: {
      dpd: 15,
      bucket: 'Y',
      daysInBucket: 5,
      assignedCollector: 'John Doe',
      assignmentDate: '2024-01-01',
      lastContactDate: '2024-01-10',
      nextFollowUp: '2024-01-16'
    }
  };

  const emiSchedule = [
    { emiNo: 1, dueDate: '2023-02-15', emiAmount: 4500, principal: 3500, interest: 1000, status: 'Paid', paidDate: '2023-02-14' },
    { emiNo: 2, dueDate: '2023-03-15', emiAmount: 4500, principal: 3600, interest: 900, status: 'Paid', paidDate: '2023-03-15' },
    { emiNo: 3, dueDate: '2023-04-15', emiAmount: 4500, principal: 3700, interest: 800, status: 'Overdue', paidDate: null }
  ];

  const paymentHistory = [
    { date: '2023-02-14', amount: 4500, mode: 'UPI', utr: 'UPI123456789', allocation: 'EMI 1' },
    { date: '2023-03-15', amount: 4500, mode: 'NEFT', utr: 'NEFT987654321', allocation: 'EMI 2' }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Loan Summary - {loanId}</Typography>
      
      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Customer Information</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Name" secondary={loanData.customer.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Phone" secondary={loanData.customer.phone} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={loanData.customer.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Address" secondary={loanData.customer.address} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Loan Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Loan Details</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Loan Amount" secondary={`₹${loanData.loanDetails.amount.toLocaleString()}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Tenure" secondary={`${loanData.loanDetails.tenure} months`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Interest Rate" secondary={`${loanData.loanDetails.interestRate}%`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Current Outstanding" secondary={`₹${loanData.loanDetails.currentOutstanding.toLocaleString()}`} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Collection Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Collection Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2">DPD</Typography>
                  <Typography variant="h6">{loanData.collectionInfo.dpd} days</Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2">Bucket</Typography>
                  <Chip label={loanData.collectionInfo.bucket} color="warning" />
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2">Assigned Collector</Typography>
                  <Typography variant="body1">{loanData.collectionInfo.assignedCollector}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">Last Contact</Typography>
                  <Typography variant="body1">{loanData.collectionInfo.lastContactDate}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">Next Follow-up</Typography>
                  <Typography variant="body1">{loanData.collectionInfo.nextFollowUp}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* EMI Schedule */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>EMI Schedule</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>EMI No.</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>EMI Amount</TableCell>
                    <TableCell>Principal</TableCell>
                    <TableCell>Interest</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Paid Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emiSchedule.map((emi) => (
                    <TableRow key={emi.emiNo}>
                      <TableCell>{emi.emiNo}</TableCell>
                      <TableCell>{emi.dueDate}</TableCell>
                      <TableCell>₹{emi.emiAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{emi.principal.toLocaleString()}</TableCell>
                      <TableCell>₹{emi.interest.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={emi.status} 
                          color={emi.status === 'Paid' ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{emi.paidDate || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Timeline</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>UTR/Reference</TableCell>
                    <TableCell>Allocation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.mode}</TableCell>
                      <TableCell>{payment.utr}</TableCell>
                      <TableCell>{payment.allocation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoanSummary;
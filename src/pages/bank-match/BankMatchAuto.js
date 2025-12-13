import React, { useState } from 'react';
import {
  Typography, Card, CardContent, Tabs, Tab, Box, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip, IconButton
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';

function BankMatchAuto() {
  const [tabValue, setTabValue] = useState(0);

  const matchedTransactions = [
    {
      id: 1,
      bankDate: '2024-01-15',
      bankAmount: 5000,
      bankUtr: 'UPI123456789',
      loanId: 'LN001',
      customerName: 'NITIN CHAURASIA',
      confidence: 100,
      status: 'Auto-Matched'
    }
  ];

  const pendingMatches = [
    {
      id: 2,
      bankDate: '2024-01-14',
      bankAmount: 4500,
      bankUtr: 'NEFT987654321',
      possibleMatches: [
        { loanId: 'LN002', customerName: 'PAWAN KESARWANI', dueAmount: 4000, confidence: 85 },
        { loanId: 'LN003', customerName: 'RAKESH SRIVASTAVA', dueAmount: 4500, confidence: 95 }
      ]
    }
  ];

  const unmatchedTransactions = [
    {
      id: 3,
      bankDate: '2024-01-13',
      bankAmount: 2500,
      bankUtr: 'UPI555666777',
      description: 'No matching loan found'
    }
  ];

  const duplicateMatches = [
    {
      id: 4,
      bankDate: '2024-01-12',
      bankAmount: 3000,
      bankUtr: 'RTGS111222333',
      matches: [
        { loanId: 'LN004', customerName: 'AFREEN', confidence: 80 },
        { loanId: 'LN005', customerName: 'ARVIND', confidence: 75 }
      ]
    }
  ];

  const handleApprove = (id) => {
    alert(`Transaction ${id} approved`);
  };

  const handleReject = (id) => {
    alert(`Transaction ${id} rejected`);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>Auto Bank Match</Typography>
      
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Matched (${matchedTransactions.length})`} />
            <Tab label={`Pending (${pendingMatches.length})`} />
            <Tab label={`Unmatched (${unmatchedTransactions.length})`} />
            <Tab label={`Duplicates (${duplicateMatches.length})`} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bank Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>UTR</TableCell>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matchedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.bankDate}</TableCell>
                    <TableCell>₹{transaction.bankAmount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.bankUtr}</TableCell>
                    <TableCell>{transaction.loanId}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.confidence}%</TableCell>
                    <TableCell>
                      <Chip label={transaction.status} color="success" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bank Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>UTR</TableCell>
                  <TableCell>Possible Matches</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingMatches.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.bankDate}</TableCell>
                    <TableCell>₹{transaction.bankAmount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.bankUtr}</TableCell>
                    <TableCell>
                      {transaction.possibleMatches.map((match, index) => (
                        <div key={index}>
                          {match.loanId} - {match.customerName} ({match.confidence}%)
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton color="success" onClick={() => handleApprove(transaction.id)}>
                        <CheckCircle />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleReject(transaction.id)}>
                        <Cancel />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bank Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>UTR</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unmatchedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.bankDate}</TableCell>
                    <TableCell>₹{transaction.bankAmount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.bankUtr}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Manual Match
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bank Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>UTR</TableCell>
                  <TableCell>Duplicate Matches</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {duplicateMatches.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.bankDate}</TableCell>
                    <TableCell>₹{transaction.bankAmount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.bankUtr}</TableCell>
                    <TableCell>
                      {transaction.matches.map((match, index) => (
                        <div key={index}>
                          {match.loanId} - {match.customerName} ({match.confidence}%)
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
}

export default BankMatchAuto;
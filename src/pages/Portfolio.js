import React, { useState } from 'react';
import {
  Typography, Card, CardContent, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton
} from '@mui/material';
import { Visibility, Payment, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Portfolio() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    branch: '',
    bucket: '',
    dpdRange: '',
    collector: ''
  });

  const portfolioData = [
    {
      loanId: 'LN001',
      customerName: 'NITIN CHAURASIA',
      phone: '7408317957',
      outstanding: 45000,
      dpd: 15,
      bucket: 'Y',
      emiAmount: 5000,
      nextDue: '2024-01-15',
      collector: 'John Doe'
    },
    {
      loanId: 'LN002',
      customerName: 'PAWAN KESARWANI',
      phone: '9811424580',
      outstanding: 32000,
      dpd: 45,
      bucket: 'M1',
      emiAmount: 4000,
      nextDue: '2024-01-10',
      collector: 'Jane Smith'
    }
  ];

  const getBucketColor = (bucket) => {
    const colors = { X: 'success', Y: 'warning', M1: 'error', M2: 'error', M3: 'error', NPA: 'error' };
    return colors[bucket] || 'default';
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Loan Portfolio</Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={filters.branch}
                  onChange={(e) => setFilters({...filters, branch: e.target.value})}
                >
                  <MenuItem value="BR001">Mumbai Central</MenuItem>
                  <MenuItem value="BR002">Delhi North</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Bucket</InputLabel>
                <Select
                  value={filters.bucket}
                  onChange={(e) => setFilters({...filters, bucket: e.target.value})}
                >
                  <MenuItem value="X">X (Current)</MenuItem>
                  <MenuItem value="Y">Y (1-30 DPD)</MenuItem>
                  <MenuItem value="M1">M1 (31-60 DPD)</MenuItem>
                  <MenuItem value="M2">M2 (61-90 DPD)</MenuItem>
                  <MenuItem value="M3">M3 (91-120 DPD)</MenuItem>
                  <MenuItem value="NPA">NPA (121+ DPD)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="DPD Range (e.g., 0-30)"
                value={filters.dpdRange}
                onChange={(e) => setFilters({...filters, dpdRange: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth sx={{ height: '56px' }}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Portfolio ({portfolioData.length} loans)</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Outstanding</TableCell>
                <TableCell>DPD</TableCell>
                <TableCell>Bucket</TableCell>
                <TableCell>EMI Amount</TableCell>
                <TableCell>Collector</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioData.map((loan) => (
                <TableRow key={loan.loanId}>
                  <TableCell>{loan.loanId}</TableCell>
                  <TableCell>{loan.customerName}</TableCell>
                  <TableCell>{loan.phone}</TableCell>
                  <TableCell>₹{loan.outstanding.toLocaleString()}</TableCell>
                  <TableCell>{loan.dpd}</TableCell>
                  <TableCell>
                    <Chip label={loan.bucket} color={getBucketColor(loan.bucket)} size="small" />
                  </TableCell>
                  <TableCell>₹{loan.emiAmount.toLocaleString()}</TableCell>
                  <TableCell>{loan.collector}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/loan/${loan.loanId}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => navigate('/payment/add', { state: { loanId: loan.loanId } })}>
                      <Payment />
                    </IconButton>
                    <IconButton onClick={() => navigate('/follow-up/calls', { state: { loanId: loan.loanId } })}>
                      <Phone />
                    </IconButton>
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

export default Portfolio;
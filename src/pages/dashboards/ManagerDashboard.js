import React from 'react';
import { Grid, Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';

function ManagerDashboard() {
  const bucketData = [
    { bucket: 'X (Current)', count: 450, percentage: 65 },
    { bucket: 'Y (1-30 DPD)', count: 120, percentage: 17 },
    { bucket: 'M1 (31-60 DPD)', count: 80, percentage: 12 },
    { bucket: 'M2 (61-90 DPD)', count: 30, percentage: 4 },
    { bucket: 'M3 (91-120 DPD)', count: 15, percentage: 2 }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Manager Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Portfolio</Typography>
              <Typography variant="h4">₹2.5Cr</Typography>
              <Typography color="textSecondary">Outstanding Amount</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Collection Rate</Typography>
              <Typography variant="h4">87%</Typography>
              <Typography color="textSecondary">This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">NPA Rate</Typography>
              <Typography variant="h4">3.2%</Typography>
              <Typography color="textSecondary">Non-Performing Assets</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Loans</Typography>
              <Typography variant="h4">695</Typography>
              <Typography color="textSecondary">Total Accounts</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Portfolio Health - Bucket Distribution</Typography>
              {bucketData.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.bucket}</Typography>
                    <Typography variant="body2">{item.count} loans ({item.percentage}%)</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.percentage} 
                    color={index < 2 ? 'success' : index < 4 ? 'warning' : 'error'}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManagerDashboard;
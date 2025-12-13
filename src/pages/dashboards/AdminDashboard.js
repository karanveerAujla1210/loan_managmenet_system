import React from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

function AdminDashboard() {
  const systemHealth = [
    { service: 'Payment Gateway', status: 'Online', color: 'success' },
    { service: 'Bank Integration', status: 'Online', color: 'success' },
    { service: 'SMS Service', status: 'Warning', color: 'warning' },
    { service: 'Email Service', status: 'Online', color: 'success' }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">45</Typography>
              <Typography color="textSecondary">Active Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Branches</Typography>
              <Typography variant="h4">8</Typography>
              <Typography color="textSecondary">Active Branches</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Daily Transactions</Typography>
              <Typography variant="h4">1,234</Typography>
              <Typography color="textSecondary">Today's Count</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">System Uptime</Typography>
              <Typography variant="h4">99.8%</Typography>
              <Typography color="textSecondary">Last 30 Days</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>System Health</Typography>
              <List>
                {systemHealth.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item.service} />
                    <Chip label={item.status} color={item.color} size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="New user created: John Collector" 
                    secondary="2 hours ago" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Bulk payment upload completed" 
                    secondary="4 hours ago" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="System backup completed" 
                    secondary="6 hours ago" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminDashboard;
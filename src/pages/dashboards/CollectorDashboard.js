import React from 'react';
import { Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

function CollectorDashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Collector Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">My Portfolio</Typography>
              <Typography variant="h4">₹2,45,000</Typography>
              <Typography color="textSecondary">Total Outstanding</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today's Target</Typography>
              <Typography variant="h4">₹50,000</Typography>
              <Typography color="textSecondary">Collection Target</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Collected Today</Typography>
              <Typography variant="h4">₹32,000</Typography>
              <Typography color="textSecondary">64% of Target</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overdue Cases</Typography>
              <Typography variant="h4">23</Typography>
              <Typography color="textSecondary">Requires Follow-up</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button variant="contained" sx={{ mr: 1, mb: 1 }}>Add Payment</Button>
              <Button variant="outlined" sx={{ mr: 1, mb: 1 }}>Log Call</Button>
              <Button variant="outlined" sx={{ mr: 1, mb: 1 }}>Schedule Visit</Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's Tasks</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Call NITIN CHAURASIA" secondary="Promise due today - ₹5,000" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Visit PAWAN KESARWANI" secondary="Field collection - ₹12,000" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Follow-up RAKESH SRIVASTAVA" secondary="Overdue 15 days - ₹8,500" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default CollectorDashboard;
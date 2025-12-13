import React from 'react';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function TeamLeadDashboard() {
  const teamPerformance = [
    { collector: 'John Doe', target: 50000, collected: 45000, efficiency: '90%' },
    { collector: 'Jane Smith', target: 60000, collected: 38000, efficiency: '63%' },
    { collector: 'Mike Johnson', target: 55000, collected: 52000, efficiency: '95%' }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Team Lead Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Team Target</Typography>
              <Typography variant="h4">₹1,65,000</Typography>
              <Typography color="textSecondary">Monthly Target</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Team Collection</Typography>
              <Typography variant="h4">₹1,35,000</Typography>
              <Typography color="textSecondary">82% Achievement</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Collectors</Typography>
              <Typography variant="h4">8</Typography>
              <Typography color="textSecondary">Team Size</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Escalations</Typography>
              <Typography variant="h4">5</Typography>
              <Typography color="textSecondary">Pending Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Team Performance</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Collector</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Collected</TableCell>
                    <TableCell>Efficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamPerformance.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.collector}</TableCell>
                      <TableCell>₹{row.target.toLocaleString()}</TableCell>
                      <TableCell>₹{row.collected.toLocaleString()}</TableCell>
                      <TableCell>{row.efficiency}</TableCell>
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

export default TeamLeadDashboard;
import React, { useState } from 'react';
import {
  Typography, Card, CardContent, Button, Box, LinearProgress, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, Chip
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

function BankMatchUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const processUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload processing
    setTimeout(() => {
      setUploadResult({
        totalRecords: 150,
        autoMatched: 120,
        pendingMatch: 25,
        unmatched: 5
      });
      setUploading(false);
    }, 3000);
  };

  const recentUploads = [
    {
      id: 1,
      fileName: 'HDFC_Statement_Jan2024.xlsx',
      uploadDate: '2024-01-15 10:30',
      records: 150,
      matched: 120,
      status: 'Completed'
    },
    {
      id: 2,
      fileName: 'ICICI_Statement_Jan2024.xlsx',
      uploadDate: '2024-01-14 15:45',
      records: 89,
      matched: 85,
      status: 'Completed'
    }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Bank Statement Upload</Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Upload Bank Statement</Typography>
          
          <Box sx={{ mb: 3 }}>
            <input
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Choose File
              </Button>
            </label>
            {file && (
              <Typography variant="body2" component="span">
                Selected: {file.name}
              </Typography>
            )}
          </Box>

          {file && (
            <Button
              variant="contained"
              onClick={processUpload}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              {uploading ? 'Processing...' : 'Upload & Process'}
            </Button>
          )}

          {uploading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Processing bank statement and matching transactions...
              </Typography>
            </Box>
          )}

          {uploadResult && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="h6">Upload Completed!</Typography>
              <Typography>Total Records: {uploadResult.totalRecords}</Typography>
              <Typography>Auto-Matched: {uploadResult.autoMatched}</Typography>
              <Typography>Pending Manual Match: {uploadResult.pendingMatch}</Typography>
              <Typography>Unmatched: {uploadResult.unmatched}</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Uploads</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Total Records</TableCell>
                <TableCell>Matched</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell>{upload.fileName}</TableCell>
                  <TableCell>{upload.uploadDate}</TableCell>
                  <TableCell>{upload.records}</TableCell>
                  <TableCell>{upload.matched}</TableCell>
                  <TableCell>
                    <Chip 
                      label={upload.status} 
                      color="success" 
                      size="small" 
                    />
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

export default BankMatchUpload;
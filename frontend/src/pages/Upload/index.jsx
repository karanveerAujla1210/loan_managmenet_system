import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Upload, FileText, Users, CreditCard, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { uploadDisbursements, uploadPayments, getUploadHistory } from '../../services/upload';
import { toast } from 'react-hot-toast';

const UploadPage = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadType, setUploadType] = useState('disbursements');
  const [isUploading, setIsUploading] = useState(false);

  const { data: uploadHistory } = useQuery(
    ['upload-history'],
    getUploadHistory
  );

  const uploadMutation = useMutation(
    (file) => {
      if (uploadType === 'disbursements') {
        return uploadDisbursements(file);
      } else {
        return uploadPayments(file);
      }
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || 'File uploaded successfully!');
        setFiles([]);
        setIsUploading(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Upload failed');
        setIsUploading(false);
      }
    }
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      for (const file of files) {
        await uploadMutation.mutateAsync(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="space-y-8 font-['Segoe_UI']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Data Upload</h1>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="disbursements"
                  checked={uploadType === 'disbursements'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="mr-2"
                />
                Disbursements
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="payments"
                  checked={uploadType === 'payments'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="mr-2"
                />
                Payments
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".json,.csv,.xlsx"
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports JSON, CSV, and Excel files
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Files:</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Files'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Customers</p>
                  <p className="text-sm text-gray-500">Customer information and KYC data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Loans</p>
                  <p className="text-sm text-gray-500">Loan applications and details</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Payments</p>
                  <p className="text-sm text-gray-500">Payment records and transactions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadHistory?.data?.map((upload, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{upload.filename}</p>
                    <p className="text-sm text-gray-500">
                      {upload.type} • {new Date(upload.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {upload.recordsSuccess}/{upload.recordsProcessed} processed
                    </p>
                    {upload.recordsError > 0 && (
                      <p className="text-sm text-red-600">{upload.recordsError} errors</p>
                    )}
                  </div>
                  {upload.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
            {(!uploadHistory?.data || uploadHistory.data.length === 0) && (
              <p className="text-center text-gray-500 py-8">No upload history found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
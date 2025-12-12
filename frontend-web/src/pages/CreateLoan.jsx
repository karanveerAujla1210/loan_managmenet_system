import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { loanService } from '../services/loanService';
import { customerService } from '../services/customerService';

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    principal: '',
    interestRate: '',
    tenure: '',
    disbursementDate: new Date().toISOString().split('T')[0]
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.principal) newErrors.principal = 'Principal amount is required';
    else if (isNaN(formData.principal) || formData.principal <= 0) newErrors.principal = 'Invalid principal amount';
    if (!formData.interestRate) newErrors.interestRate = 'Interest rate is required';
    else if (isNaN(formData.interestRate) || formData.interestRate <= 0) newErrors.interestRate = 'Invalid interest rate';
    if (!formData.tenure) newErrors.tenure = 'Tenure is required';
    else if (isNaN(formData.tenure) || formData.tenure <= 0) newErrors.tenure = 'Invalid tenure';
    if (!formData.disbursementDate) newErrors.disbursementDate = 'Disbursement date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const loanData = {
        ...formData,
        principal: parseFloat(formData.principal),
        interestRate: parseFloat(formData.interestRate),
        tenure: parseInt(formData.tenure)
      };
      
      await loanService.createLoan(loanData);
      navigate('/loans');
    } catch (error) {
      console.error('Error creating loan:', error);
      setErrors({ submit: error.message || 'Failed to create loan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Create Loan"
        subtitle="Create a new loan for a customer"
      />

      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Principal Amount"
                type="number"
                name="principal"
                value={formData.principal}
                onChange={handleChange}
                error={errors.principal}
                required
                placeholder="Enter principal amount"
              />
              <Input
                label="Interest Rate (%)"
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                error={errors.interestRate}
                required
                placeholder="Enter interest rate"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tenure (months)"
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                error={errors.tenure}
                required
                placeholder="Enter tenure in months"
              />
              <Input
                label="Disbursement Date"
                type="date"
                name="disbursementDate"
                value={formData.disbursementDate}
                onChange={handleChange}
                error={errors.disbursementDate}
                required
              />
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Loan'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/loans')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateLoan;
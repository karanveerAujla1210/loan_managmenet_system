# Frontend Component Structure & Implementation

## Component Hierarchy

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleBasedRedirect.jsx
│   ├── dashboard/
│   │   ├── DashboardLayout.jsx
│   │   ├── MetricsCards.jsx
│   │   ├── BucketSummary.jsx
│   │   ├── BranchPerformance.jsx
│   │   ├── CollectorPerformance.jsx
│   │   └── QuickActions.jsx
│   ├── loans/
│   │   ├── LoanSummary.jsx
│   │   ├── EMIScheduleTable.jsx
│   │   ├── PaymentHistory.jsx
│   │   ├── LoanFilters.jsx
│   │   └── LoanCard.jsx
│   ├── payments/
│   │   ├── PaymentForm.jsx
│   │   ├── PaymentAllocation.jsx
│   │   ├── ReceiptGenerator.jsx
│   │   └── BulkPaymentUpload.jsx
│   ├── overdue/
│   │   ├── BucketView.jsx
│   │   ├── OverdueFilters.jsx
│   │   ├── BulkActions.jsx
│   │   └── FollowUpScheduler.jsx
│   ├── legal/
│   │   ├── CaseManagement.jsx
│   │   ├── DocumentUpload.jsx
│   │   ├── HearingCalendar.jsx
│   │   └── NoticeGenerator.jsx
│   ├── reconciliation/
│   │   ├── BankStatementUpload.jsx
│   │   ├── UTRMatching.jsx
│   │   ├── MismatchResolution.jsx
│   │   └── ReconciliationReport.jsx
│   ├── reports/
│   │   ├── ReportGenerator.jsx
│   │   ├── CollectionReport.jsx
│   │   ├── PerformanceAnalytics.jsx
│   │   └── RegulatoryReports.jsx
│   ├── customers/
│   │   ├── CustomerProfile.jsx
│   │   ├── CustomerSearch.jsx
│   │   ├── CallLogManager.jsx
│   │   └── DocumentRepository.jsx
│   ├── communication/
│   │   ├── SMSTemplates.jsx
│   │   ├── EmailCampaigns.jsx
│   │   ├── WhatsAppIntegration.jsx
│   │   └── CallCenterIntegration.jsx
│   └── common/
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── DataTable.jsx
│       ├── Modal.jsx
│       ├── DatePicker.jsx
│       ├── SearchBox.jsx
│       ├── StatusBadge.jsx
│       └── LoadingSpinner.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── LoansPage.jsx
│   ├── OverduePage.jsx
│   ├── LegalPage.jsx
│   ├── PaymentsPage.jsx
│   ├── ReconciliationPage.jsx
│   ├── ReportsPage.jsx
│   ├── CustomersPage.jsx
│   ├── CommunicationPage.jsx
│   └── SettingsPage.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useDashboard.js
│   ├── useLoans.js
│   ├── usePayments.js
│   ├── useOverdue.js
│   └── useReports.js
├── services/
│   ├── authService.js
│   ├── loanService.js
│   ├── paymentService.js
│   ├── customerService.js
│   ├── reportService.js
│   └── apiClient.js
├── utils/
│   ├── dateUtils.js
│   ├── currencyUtils.js
│   ├── validationUtils.js
│   ├── exportUtils.js
│   └── constants.js
└── styles/
    ├── globals.css
    ├── components.css
    └── themes.css
```

## Key Component Implementations

### 1. Dashboard Metrics Cards Component
```jsx
// components/dashboard/MetricsCards.jsx
const MetricsCards = ({ data }) => {
  return (
    <div className="metrics-grid">
      <MetricCard
        title="Today's Collection"
        value={formatCurrency(data.todayCollection)}
        icon="💰"
        trend={data.collectionTrend}
      />
      <MetricCard
        title="Total Overdue"
        value={formatCurrency(data.totalOverdue)}
        icon="⚠️"
        status="warning"
      />
      <MetricCard
        title="Overdue Cases"
        value={data.overdueCount}
        icon="📋"
        subtitle="cases"
      />
      <MetricCard
        title="Collection Target"
        value={`${data.achievement}%`}
        icon="🎯"
        progress={data.achievement}
      />
    </div>
  );
};
```

### 2. Bucket Summary Component
```jsx
// components/dashboard/BucketSummary.jsx
const BucketSummary = ({ buckets }) => {
  const bucketConfig = [
    { key: 'current', label: 'Current', color: 'green' },
    { key: 'x', label: 'X (1-30)', color: 'yellow' },
    { key: 'y', label: 'Y (31-60)', color: 'orange' },
    { key: 'm1', label: 'M1 (61-90)', color: 'red' },
    { key: 'm2', label: 'M2 (91-180)', color: 'purple' },
    { key: 'm3', label: 'M3 (181+)', color: 'dark-red' },
    { key: 'legal', label: 'Legal', color: 'black' }
  ];

  return (
    <div className="bucket-summary">
      <h3>Bucket Analysis</h3>
      <div className="bucket-grid">
        {bucketConfig.map(bucket => (
          <BucketCard
            key={bucket.key}
            label={bucket.label}
            amount={buckets[bucket.key]?.amount || 0}
            count={buckets[bucket.key]?.count || 0}
            color={bucket.color}
            onClick={() => navigateToBucket(bucket.key)}
          />
        ))}
      </div>
    </div>
  );
};
```

### 3. Payment Form Component
```jsx
// components/payments/PaymentForm.jsx
const PaymentForm = ({ loanId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMode: 'UPI',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const [allocation, setAllocation] = useState({
    principal: 0,
    interest: 0,
    penalty: 0
  });

  const handleAmountChange = (amount) => {
    setFormData(prev => ({ ...prev, amount }));
    // Auto-calculate allocation
    calculateAllocation(amount).then(setAllocation);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentService.updatePayment(loanId, {
        ...formData,
        allocation
      });
      onSuccess();
      showNotification('Payment updated successfully');
    } catch (error) {
      showError('Failed to update payment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Payment Amount</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Payment Mode</label>
        <select
          value={formData.paymentMode}
          onChange={(e) => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
        >
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <div className="allocation-preview">
        <h4>Auto-Allocation Preview</h4>
        <div className="allocation-grid">
          <div>Principal: {formatCurrency(allocation.principal)}</div>
          <div>Interest: {formatCurrency(allocation.interest)}</div>
          <div>Penalty: {formatCurrency(allocation.penalty)}</div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save Payment</button>
        <button type="button" onClick={handleSaveAndPrint}>
          Save & Print Receipt
        </button>
      </div>
    </form>
  );
};
```

### 4. Overdue Bucket View Component
```jsx
// components/overdue/BucketView.jsx
const BucketView = () => {
  const [selectedBucket, setSelectedBucket] = useState('x');
  const [filters, setFilters] = useState({
    branch: '',
    collector: '',
    dpdRange: '',
    amountRange: ''
  });
  const [selectedLoans, setSelectedLoans] = useState([]);

  const { data: overdueLoans, loading } = useOverdue(selectedBucket, filters);

  const handleBulkAction = async (action) => {
    try {
      await overdueService.bulkAction(action, selectedLoans);
      showNotification(`${action} completed for ${selectedLoans.length} loans`);
      setSelectedLoans([]);
    } catch (error) {
      showError(`Failed to execute ${action}`);
    }
  };

  return (
    <div className="bucket-view">
      <div className="bucket-tabs">
        {['x', 'y', 'm1', 'm2', 'm3', 'legal'].map(bucket => (
          <button
            key={bucket}
            className={`bucket-tab ${selectedBucket === bucket ? 'active' : ''}`}
            onClick={() => setSelectedBucket(bucket)}
          >
            {getBucketLabel(bucket)}
          </button>
        ))}
      </div>

      <OverdueFilters filters={filters} onChange={setFilters} />

      <div className="bulk-actions">
        <span>Selected: {selectedLoans.length} loans</span>
        <button onClick={() => handleBulkAction('sendSMS')}>Send SMS</button>
        <button onClick={() => handleBulkAction('scheduleCalls')}>Schedule Calls</button>
        <button onClick={() => handleBulkAction('assignCollector')}>Assign Collector</button>
        <button onClick={() => handleBulkAction('generateNotices')}>Generate Notices</button>
      </div>

      <DataTable
        data={overdueLoans}
        columns={overdueColumns}
        loading={loading}
        selectable
        selectedRows={selectedLoans}
        onSelectionChange={setSelectedLoans}
        onRowClick={(loan) => navigate(`/loans/${loan.id}`)}
      />
    </div>
  );
};
```

### 5. Bank Reconciliation Component
```jsx
// components/reconciliation/UTRMatching.jsx
const UTRMatching = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [matchingResults, setMatchingResults] = useState(null);
  const [mismatches, setMismatches] = useState([]);

  const handleFileUpload = async (file) => {
    try {
      const results = await reconciliationService.processStatement(file);
      setMatchingResults(results);
      setMismatches(results.unmatched);
    } catch (error) {
      showError('Failed to process bank statement');
    }
  };

  const handleResolveMismatch = async (transactionId, resolution) => {
    try {
      await reconciliationService.resolveMismatch(transactionId, resolution);
      setMismatches(prev => prev.filter(m => m.id !== transactionId));
      showNotification('Mismatch resolved successfully');
    } catch (error) {
      showError('Failed to resolve mismatch');
    }
  };

  return (
    <div className="utr-matching">
      <div className="upload-section">
        <h3>Upload Bank Statement</h3>
        <FileUpload
          accept=".csv,.xlsx"
          onUpload={handleFileUpload}
          template="/templates/bank-statement-template.csv"
        />
      </div>

      {matchingResults && (
        <div className="matching-results">
          <div className="results-summary">
            <div className="summary-card success">
              <h4>Matched Transactions</h4>
              <span className="count">{matchingResults.matched.length}</span>
            </div>
            <div className="summary-card warning">
              <h4>Unmatched Transactions</h4>
              <span className="count">{matchingResults.unmatched.length}</span>
            </div>
          </div>

          <div className="matched-transactions">
            <h4>✅ Matched Transactions</h4>
            <DataTable
              data={matchingResults.matched}
              columns={matchedColumns}
              actions={[
                { label: 'View Details', onClick: (row) => viewTransactionDetails(row) }
              ]}
            />
          </div>

          <div className="unmatched-transactions">
            <h4>❌ Unmatched Transactions</h4>
            <DataTable
              data={mismatches}
              columns={unmatchedColumns}
              actions={[
                { label: 'Resolve', onClick: (row) => openResolutionModal(row) }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
```

## State Management Structure

### Redux Store Structure
```javascript
// store/index.js
const store = {
  auth: {
    user: null,
    token: null,
    permissions: [],
    isAuthenticated: false
  },
  dashboard: {
    metrics: {},
    buckets: {},
    branchPerformance: [],
    collectorPerformance: [],
    loading: false
  },
  loans: {
    disbursedLoans: [],
    overdueLoans: {},
    selectedLoan: null,
    filters: {},
    pagination: {}
  },
  payments: {
    recentPayments: [],
    pendingAllocations: [],
    receipts: []
  },
  customers: {
    customerProfiles: {},
    searchResults: [],
    callLogs: {}
  },
  reports: {
    generatedReports: [],
    scheduledReports: [],
    reportData: {}
  },
  ui: {
    sidebarCollapsed: false,
    activeModule: 'dashboard',
    notifications: [],
    modals: {}
  }
};
```

## API Integration Points

### Service Layer Structure
```javascript
// services/apiClient.js
class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL;
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // CRUD operations
  get(endpoint) { return this.request(endpoint); }
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); }
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

// services/loanService.js
export const loanService = {
  getDisbursedLoans: (filters) => apiClient.get(`/loans/disbursed?${new URLSearchParams(filters)}`),
  getOverdueLoans: (bucket) => apiClient.get(`/loans/overdue/${bucket}`),
  getLoanDetails: (loanId) => apiClient.get(`/loans/${loanId}`),
  updateLoanStatus: (loanId, status) => apiClient.put(`/loans/${loanId}/status`, { status }),
  getEMISchedule: (loanId) => apiClient.get(`/loans/${loanId}/emi-schedule`),
  getPaymentHistory: (loanId) => apiClient.get(`/loans/${loanId}/payments`)
};
```

This component structure provides a scalable, maintainable frontend architecture for the loan servicing CRM with clear separation of concerns and reusable components.
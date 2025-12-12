# NBFC Analytics & Dashboard System

## 🚀 Complete Enterprise Analytics Solution

This analytics system provides comprehensive insights into your NBFC loan portfolio with real-time dashboards, advanced KPIs, and drill-down capabilities.

## 📊 Features Implemented

### 1. Portfolio Analytics Dashboard
- **Total Portfolio Overview**: Disbursed amount, live loans, outstanding balances
- **PAR Analysis**: Portfolio at Risk by 0, 7, 14, 30, 60, 90+ days
- **Bucket Distribution**: Current, X, Y, M1, M2, M3, NPA segmentation
- **Real-time KPIs**: Collection efficiency, recovery rates, default ratios

### 2. Collections Performance Dashboard
- **Agent Performance Ranking**: Recovery rates, assigned loans, collections
- **Collection Efficiency**: Expected vs Actual collections
- **DPD Distribution**: Days Past Due analysis across portfolio
- **Cashflow Forecasting**: 12-week forward-looking collections

### 3. Legal Workflow Dashboard
- **Legal Cases Tracking**: By stage (Notice, Summons, Hearing, Judgment)
- **Case Aging Analysis**: Average case age and progression
- **Recovery Expectations**: Expected vs actual recovery amounts
- **Lawyer Assignment**: Performance by legal counsel

### 4. Default/Delinquency Dashboard
- **Default Aging**: 91-120, 121-180, 181-365, 365+ day buckets
- **Loss Analysis**: Expected loss calculations and provisions
- **Recovery Tracking**: Post-default recovery performance
- **Write-off Analysis**: Write-off ratios and trends

### 5. Closed Loans Dashboard
- **Closure Analytics**: Total closed, early closures, average closure time
- **Monthly Trends**: Closure patterns and seasonality
- **Performance Metrics**: Closure rates and efficiency
- **Revenue Impact**: Closed loan revenue analysis

### 6. Advanced Analytics
- **Vintage Analysis**: Cohort performance over time
- **Roll Rate Matrix**: Bucket-to-bucket migration patterns
- **Flow-Through Analysis**: Customer journey through buckets
- **Seasonal Patterns**: Monthly, quarterly performance trends

## 🏗️ Technical Architecture

### Backend (Node.js + MongoDB)
```
backend/src/modules/analytics/
├── analytics.model.js      # Data models for analytics
├── analytics.service.js    # Business logic & aggregations
├── analytics.controller.js # API endpoints
└── analytics.routes.js     # Route definitions
```

### Frontend (React + Recharts)
```
frontend-web/src/
├── components/analytics/
│   ├── KPIWidget.jsx          # Reusable KPI cards
│   ├── BucketChart.jsx        # Pie chart for buckets
│   ├── CashflowChart.jsx      # Bar chart for forecasting
│   ├── AgentPerformanceChart.jsx # Performance rankings
│   └── FilterPanel.jsx       # Advanced filtering
├── pages/
│   ├── Analytics.jsx         # Main dashboard
│   ├── LegalDashboard.jsx    # Legal cases drill-down
│   ├── DefaultsDashboard.jsx # Defaults analysis
│   └── ClosedLoansDashboard.jsx # Closed loans insights
└── services/
    └── analyticsService.js   # API service layer
```

## 📈 Key Performance Indicators (KPIs)

### Portfolio KPIs
- **Total Disbursed**: Cumulative loan disbursements
- **Live Loan Count**: Active + Overdue loans
- **Outstanding Principal**: Current principal balance
- **PAR 30/60/90**: Portfolio at Risk percentages
- **Collection Efficiency**: Collections / Due amount
- **Recovery Rate**: Recovered / Total outstanding

### Risk KPIs  
- **Default Rate**: Defaulted loans / Total loans
- **Roll Rate**: Bucket migration percentages
- **Loss Rate**: Write-offs / Disbursements
- **Provision Coverage**: Provisions / PAR amount

### Operational KPIs
- **Agent Productivity**: Collections per agent
- **Legal Recovery**: Recovery from legal cases
- **Closure Rate**: Closed loans / Total loans
- **Early Settlement**: Pre-closure percentage

## 🔧 API Endpoints

### Core Analytics
- `GET /api/v1/analytics/overview` - Portfolio overview
- `GET /api/v1/analytics/buckets` - Bucket analysis
- `GET /api/v1/analytics/cashflow-forecast` - Cashflow projections
- `GET /api/v1/analytics/roll-rates` - Roll rate matrix

### Performance Analytics  
- `GET /api/v1/analytics/agent-performance` - Agent metrics
- `GET /api/v1/analytics/collection-efficiency` - Collection KPIs
- `GET /api/v1/analytics/dpd-distribution` - DPD analysis

### Specialized Dashboards
- `GET /api/v1/analytics/legal` - Legal cases
- `GET /api/v1/analytics/defaults` - Default analysis  
- `GET /api/v1/analytics/closed` - Closed loans
- `GET /api/v1/analytics/vintage/:cohort` - Vintage analysis

## 🎯 Business Intelligence Features

### 1. Bucket Analysis & DPD Logic
```javascript
// Bucket Classification
Current: DPD = 0
X: DPD 1-7 days  
Y: DPD 8-14 days
M1: DPD 15-30 days
M2: DPD 31-60 days  
M3: DPD 61-90 days
NPA: DPD > 90 days
```

### 2. Roll Rate Calculation
```javascript
// Migration Matrix (From → To)
Current → X: Early delinquency rate
X → Y: Progression rate
Y → M1: Escalation rate  
M1 → M2: Deterioration rate
M2 → M3: Critical rate
M3 → NPA: Default rate
```

### 3. Collection Efficiency Formula
```javascript
CE% = (Actual Collections / Expected Collections) × 100
Recovery Rate = (Total Recovered / Total Outstanding) × 100
```

### 4. Cashflow Forecasting
- **Weekly Projections**: Next 12 weeks expected collections
- **Monthly Forecasts**: Seasonal adjustment factors
- **Scenario Analysis**: Best/worst case projections

## 🚀 Quick Start

### 1. Automated Setup
```bash
# Run the setup script
setup-analytics.bat
```

### 2. Manual Setup
```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup  
cd frontend-web
npm install recharts lucide-react
npm run dev
```

### 3. Access Dashboard
- Open browser: `http://localhost:5173`
- Login with credentials
- Navigate to **Analytics** in sidebar
- Explore drill-down dashboards

## 📊 Dashboard Navigation

### Main Analytics Dashboard (`/analytics`)
- Portfolio overview with KPI widgets
- Bucket distribution pie chart
- Cashflow forecast bar chart  
- Agent performance rankings
- PAR analysis grid

### Legal Dashboard (`/analytics/legal`)
- Legal cases by stage
- Case aging analysis
- Recovery expectations
- Lawyer performance

### Defaults Dashboard (`/analytics/defaults`)  
- Default aging buckets
- Loss analysis charts
- Recovery tracking
- Write-off trends

### Closed Loans Dashboard (`/analytics/closed`)
- Closure performance metrics
- Monthly closure trends
- Early settlement analysis
- Revenue impact

## 🔍 Advanced Filtering

All dashboards support filtering by:
- **Date Range**: Start and end dates
- **Bucket**: Current, X, Y, M1, M2, M3, NPA
- **Status**: Active, Overdue, Closed, Defaulted
- **Agent**: Individual agent performance
- **Branch**: Branch-wise analysis

## 📱 Responsive Design

- **Desktop**: Full dashboard with all charts
- **Tablet**: Responsive grid layout
- **Mobile**: Stacked KPI cards and simplified charts

## 🔐 Security & Performance

- **Authentication**: JWT-based API security
- **Caching**: Analytics snapshots for performance
- **Indexing**: Optimized MongoDB queries
- **Rate Limiting**: API throttling protection

## 📈 Future Enhancements

- **Predictive Analytics**: ML-based default prediction
- **Automated Alerts**: Threshold-based notifications  
- **Export Features**: PDF/Excel report generation
- **Real-time Updates**: WebSocket-based live data
- **Mobile App**: Native mobile analytics

## 🛠️ Troubleshooting

### Common Issues
1. **Charts not loading**: Check recharts installation
2. **API errors**: Verify backend server is running
3. **Data not showing**: Check MongoDB connection
4. **Performance issues**: Review query optimization

### Support
- Check console logs for errors
- Verify API endpoints in Network tab
- Ensure proper authentication tokens
- Review MongoDB aggregation pipelines

---

## 📋 Summary

This enterprise-grade analytics system provides:

✅ **Complete Portfolio Visibility** - Real-time KPIs and trends  
✅ **Advanced Risk Analytics** - PAR, DPD, roll rates, defaults  
✅ **Operational Intelligence** - Agent performance, collections efficiency  
✅ **Legal Case Management** - Case tracking and recovery analysis  
✅ **Predictive Insights** - Cashflow forecasting and vintage analysis  
✅ **Drill-down Capabilities** - Detailed analysis pages  
✅ **Mobile Responsive** - Works on all devices  
✅ **High Performance** - Optimized queries and caching  

The system is production-ready and provides all the analytics capabilities required for a modern NBFC loan management platform.
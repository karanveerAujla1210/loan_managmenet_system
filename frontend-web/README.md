# NBFC Loan Management System - Frontend

A complete React-based frontend for the NBFC Loan Management System with authentication, customer management, loan processing, and collections.

## Features

### 🔐 Authentication
- JWT-based login system
- Protected routes with automatic token validation
- Automatic logout on token expiry

### 👥 Customer Management
- Customer list with search functionality
- Create new customers with KYC support
- Customer detail view with loan history
- Form validation and error handling

### 💰 Loan Management
- Loan list with advanced filtering
- Create loans with customer selection
- Detailed loan view with payment schedule
- Transaction history and payment processing
- EMI calculations and outstanding tracking

### 📊 Collections
- Due today and overdue loan tracking
- DPD (Days Past Due) indicators
- Payment recording with multiple modes
- Promise to Pay (PTP) management
- Collection notes and follow-up tracking

### 📈 Dashboard
- Real-time KPI widgets
- Customer and loan statistics
- Outstanding amount tracking
- Collection efficiency metrics

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Modal.jsx
│   ├── Table.jsx
│   ├── PageHeader.jsx
│   ├── StatWidget.jsx
│   └── Layout.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Customers.jsx
│   ├── CreateCustomer.jsx
│   ├── CustomerDetail.jsx
│   ├── Loans.jsx
│   ├── CreateLoan.jsx
│   ├── LoanDetail.jsx
│   └── Collections.jsx
├── services/           # API service layer
│   ├── api.js
│   ├── customerService.js
│   ├── loanService.js
│   └── collectionService.js
├── router/
│   └── AppRouter.jsx   # Route configuration
├── App.jsx
├── main.jsx
└── index.css
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Backend API running on http://localhost:5000

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend-web
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Login with your backend credentials

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login

### Customers
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers/:id` - Get customer details

### Loans
- `GET /api/v1/loans` - List loans
- `POST /api/v1/loans` - Create loan
- `GET /api/v1/loans/:id` - Get loan details
- `POST /api/v1/loans/:id/payments` - Add payment

### Collections
- `GET /api/v1/loans/due?type=today` - Due today loans
- `GET /api/v1/loans/due?type=overdue` - Overdue loans
- `POST /api/v1/loans/:id/ptp` - Add Promise to Pay
- `POST /api/v1/loans/:id/notes` - Add collection notes

## Key Features

### 🎨 UI Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Consistent Styling**: Reusable components with unified design system
- **Interactive Tables**: Sortable columns with click-to-navigate
- **Modal System**: Clean modal dialogs for forms and actions
- **Status Badges**: Color-coded status indicators

### 🔒 Security
- **JWT Token Management**: Automatic token attachment and refresh
- **Protected Routes**: Route-level authentication guards
- **Input Validation**: Client-side form validation
- **Error Handling**: Graceful error handling with user feedback

### 📱 User Experience
- **Search & Filter**: Real-time search across all modules
- **Loading States**: Proper loading indicators
- **Error Messages**: Clear error messaging
- **Navigation**: Intuitive navigation with breadcrumbs

### 🚀 Performance
- **Code Splitting**: Lazy loading for optimal performance
- **Optimized Builds**: Vite for fast builds and HMR
- **Efficient API Calls**: Proper caching and error handling

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper prop validation
- Follow consistent naming conventions
- Keep components focused and reusable

### State Management
- Use React hooks for local state
- Implement proper error boundaries
- Handle loading states consistently

### API Integration
- Use the service layer for all API calls
- Implement proper error handling
- Add loading states for better UX

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for http://localhost:3000
2. **API Connection**: Verify backend is running on port 5000
3. **Token Issues**: Check localStorage for valid JWT token
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Debug Mode
```bash
npm run dev -- --debug
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include loading states
4. Test all user flows
5. Ensure responsive design

## License

Private - NBFC Loan Management System
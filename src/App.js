import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Login from './pages/Login';
import CollectorDashboard from './pages/dashboards/CollectorDashboard';
import TeamLeadDashboard from './pages/dashboards/TeamLeadDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import Portfolio from './pages/Portfolio';
import LoanSummary from './pages/LoanSummary';
import PaymentAdd from './pages/payments/PaymentAdd';
import PaymentHistory from './pages/payments/PaymentHistory';
import BankMatchUpload from './pages/bank-match/BankMatchUpload';
import BankMatchAuto from './pages/bank-match/BankMatchAuto';
import BankMatchManual from './pages/bank-match/BankMatchManual';
import FollowUpCalls from './pages/follow-up/FollowUpCalls';
import FollowUpNotes from './pages/follow-up/FollowUpNotes';
import FollowUpPromises from './pages/follow-up/FollowUpPromises';
import CollectionsReport from './pages/reports/CollectionsReport';
import BranchReport from './pages/reports/BranchReport';
import AgingReport from './pages/reports/AgingReport';
import OverdueReport from './pages/reports/OverdueReport';
import UserManagement from './pages/admin/UserManagement';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: 9,
    h1: { fontSize: '9px', fontWeight: 400 },
    h2: { fontSize: '9px', fontWeight: 400 },
    h3: { fontSize: '9px', fontWeight: 400 },
    h4: { fontSize: '9px', fontWeight: 400 },
    h5: { fontSize: '1rem', fontWeight: 700 },
    h6: { fontSize: '9px', fontWeight: 400 },
    body1: { fontSize: '9px' },
    body2: { fontSize: '9px' },
    button: { fontSize: '9px', textTransform: 'none' },
    caption: { fontSize: '9px' },
    overline: { fontSize: '9px' },
    subtitle1: { fontSize: '9px' },
    subtitle2: { fontSize: '9px' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { fontSize: '9px !important' },
        'h5': { fontSize: '1rem !important', fontWeight: '700 !important' }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: '9px !important' }
      }
    },
    MuiChip: {
      styleOverrides: {
        label: { fontSize: '9px !important' }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': { fontSize: '9px !important' },
          '& .MuiInputLabel-root': { fontSize: '9px !important' },
          '& .MuiFormHelperText-root': { fontSize: '9px !important' }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontSize: '9px !important' },
        secondary: { fontSize: '9px !important' }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { fontSize: '9px !important' }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: { fontSize: '9px !important' },
        h5: { fontSize: '1rem !important', fontWeight: '700 !important' }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: { fontSize: '9px !important' }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: '9px !important' }
      }
    },
    MuiAlert: {
      styleOverrides: {
        message: { fontSize: '9px !important' }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard/collector" replace />} />
            
            {/* Dashboards */}
            <Route path="dashboard/collector" element={<CollectorDashboard />} />
            <Route path="dashboard/team-lead" element={<TeamLeadDashboard />} />
            <Route path="dashboard/manager" element={<ManagerDashboard />} />
            <Route path="dashboard/admin" element={<AdminDashboard />} />
            
            {/* Portfolio */}
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="loan/:loanId" element={<LoanSummary />} />
            
            {/* Payments */}
            <Route path="payment/add" element={<PaymentAdd />} />
            <Route path="payment/history" element={<PaymentHistory />} />
            
            {/* Bank Match */}
            <Route path="bank-match/upload" element={<BankMatchUpload />} />
            <Route path="bank-match/auto" element={<BankMatchAuto />} />
            <Route path="bank-match/manual" element={<BankMatchManual />} />
            
            {/* Follow-up */}
            <Route path="follow-up/calls" element={<FollowUpCalls />} />
            <Route path="follow-up/notes" element={<FollowUpNotes />} />
            <Route path="follow-up/promises" element={<FollowUpPromises />} />
            
            {/* Reports */}
            <Route path="reports/collections" element={<CollectionsReport />} />
            <Route path="reports/branch" element={<BranchReport />} />
            <Route path="reports/aging" element={<AgingReport />} />
            <Route path="reports/overdue" element={<OverdueReport />} />
            
            {/* Admin */}
            <Route path="admin/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
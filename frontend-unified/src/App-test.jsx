import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

// Simple test components
const TestLogin = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <h2 className="text-3xl font-bold text-center">Login</h2>
      <form className="space-y-6">
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
);

const TestDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Customers</h3>
        <p className="text-3xl font-bold text-blue-600">1,250</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Active Loans</h3>
        <p className="text-3xl font-bold text-green-600">890</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Collections</h3>
        <p className="text-3xl font-bold text-purple-600">₹32L</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Overdue</h3>
        <p className="text-3xl font-bold text-red-600">45</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<TestLogin />} />
            <Route path="/dashboard" element={<TestDashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

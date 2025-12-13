import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'loans', name: 'Disbursed Loans', icon: '💰' },
    { id: 'overdue', name: 'Overdue Management', icon: '⚠️' },
    { id: 'payments', name: 'Payment Processing', icon: '💸' },
    { id: 'legal', name: 'Legal Cases', icon: '⚖️' },
    { id: 'reconciliation', name: 'Bank Reconciliation', icon: '🏦' },
    { id: 'customers', name: 'Customer Management', icon: '👤' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white'
            }}>
              💼
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Loan CRM</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Collections System</p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                background: currentPage === item.id ? '#3b82f6' : 'transparent',
                color: currentPage === item.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          background: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              AD
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>Admin User</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>admin@loancrm.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = ({ setCurrentPage }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch real data from MongoDB LoanCRM database
    const fetchDashboardData = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetch('http://localhost:5000/api/customers');
        const customers = customersResponse.ok ? await customersResponse.json() : [];
        
        // Fetch loans
        const loansResponse = await fetch('http://localhost:5000/api/loans');
        const loans = loansResponse.ok ? await loansResponse.json() : [];
        
        // Fetch payments
        const paymentsResponse = await fetch('http://localhost:5000/api/payments');
        const payments = paymentsResponse.ok ? await paymentsResponse.json() : [];
        
        // Calculate dashboard metrics from real data
        const today = new Date().toDateString();
        const todayPayments = payments.filter(p => new Date(p.paymentDate).toDateString() === today);
        const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);
        
        const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'disbursed');
        const overdueLoans = activeLoans.filter(l => {
          const dueDate = new Date(l.nextEMIDate);
          return dueDate < new Date();
        });
        
        const totalOverdue = overdueLoans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
        
        // Calculate DPD buckets
        const buckets = {
          current: { amount: 0, count: 0 },
          x: { amount: 0, count: 0 },
          y: { amount: 0, count: 0 },
          m1: { amount: 0, count: 0 },
          m2: { amount: 0, count: 0 },
          m3: { amount: 0, count: 0 },
          legal: { amount: 0, count: 0 }
        };
        
        activeLoans.forEach(loan => {
          const dueDate = new Date(loan.nextEMIDate);
          const today = new Date();
          const dpd = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
          const amount = loan.outstandingAmount || 0;
          
          if (dpd <= 0) {
            buckets.current.amount += amount;
            buckets.current.count++;
          } else if (dpd <= 30) {
            buckets.x.amount += amount;
            buckets.x.count++;
          } else if (dpd <= 60) {
            buckets.y.amount += amount;
            buckets.y.count++;
          } else if (dpd <= 90) {
            buckets.m1.amount += amount;
            buckets.m1.count++;
          } else if (dpd <= 180) {
            buckets.m2.amount += amount;
            buckets.m2.count++;
          } else if (dpd <= 365) {
            buckets.m3.amount += amount;
            buckets.m3.count++;
          } else {
            buckets.legal.amount += amount;
            buckets.legal.count++;
          }
        });
        
        // Recent activities from real data
        const recentPayments = payments
          .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
          .slice(0, 3)
          .map(p => {
            const customer = customers.find(c => c._id === p.customerId);
            return {
              type: 'payment',
              customer: customer ? `${customer.firstName} ${customer.lastName || ''}`.trim() : 'Unknown Customer',
              amount: p.amount,
              time: new Date(p.paymentDate).toLocaleDateString()
            };
          });
        
        const targetAchievement = Math.min(100, Math.round((todayCollection / 300000) * 100));
        
        setDashboardData({
          todayCollection,
          totalOverdue,
          overdueCount: overdueLoans.length,
          targetAchievement,
          buckets,
          recentActivities: recentPayments,
          totalCustomers: customers.length,
          totalLoans: loans.length,
          activeLoans: activeLoans.length
        });
        
      } catch (error) {
        console.error('Failed to fetch data from MongoDB:', error);
        setDashboardData({
          todayCollection: 0,
          totalOverdue: 0,
          overdueCount: 0,
          targetAchievement: 0,
          buckets: {
            current: { amount: 0, count: 0 },
            x: { amount: 0, count: 0 },
            y: { amount: 0, count: 0 },
            m1: { amount: 0, count: 0 },
            m2: { amount: 0, count: 0 },
            m3: { amount: 0, count: 0 },
            legal: { amount: 0, count: 0 }
          },
          recentActivities: [],
          totalCustomers: 0,
          totalLoans: 0,
          activeLoans: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Welcome back, Admin! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Portfolio: {dashboardData.totalCustomers} customers, {dashboardData.activeLoans} active loans
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                Today's Collection
              </p>
              <p style={{ margin: '8px 0', fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {formatCurrency(dashboardData.todayCollection)}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                ↗ +12% from yesterday
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              💰
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #ef4444'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                Total Overdue
              </p>
              <p style={{ margin: '8px 0', fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {formatCurrency(dashboardData.totalOverdue)}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
                {dashboardData.overdueCount} active cases
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fee2e2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ⚠️
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                Active Cases
              </p>
              <p style={{ margin: '8px 0', fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {dashboardData.overdueCount}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>
                Follow-ups pending
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📋
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                Target Achievement
              </p>
              <p style={{ margin: '8px 0', fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {dashboardData.targetAchievement}%
              </p>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
                marginTop: '8px'
              }}>
                <div style={{
                  width: `${dashboardData.targetAchievement}%`,
                  height: '100%',
                  background: '#3b82f6',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🎯
            </div>
          </div>
        </div>

      </div>

      {/* Bucket Analysis */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '32px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            margin: 0, 
            color: '#111827',
            marginBottom: '8px'
          }}>
            DPD Bucket Analysis
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Portfolio distribution by Days Past Due ranges
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '16px' 
        }}>
          
          {[
            { key: 'current', name: 'Current', dpd: '0 DPD', color: '#10b981', bg: '#ecfdf5', icon: '✓' },
            { key: 'x', name: 'X Bucket', dpd: '1-30 DPD', color: '#f59e0b', bg: '#fffbeb', icon: '!' },
            { key: 'y', name: 'Y Bucket', dpd: '31-60 DPD', color: '#f97316', bg: '#fff7ed', icon: '⚠' },
            { key: 'm1', name: 'M1 Bucket', dpd: '61-90 DPD', color: '#ef4444', bg: '#fef2f2', icon: '⚡' },
            { key: 'm2', name: 'M2 Bucket', dpd: '91-180 DPD', color: '#8b5cf6', bg: '#faf5ff', icon: '🔥' },
            { key: 'm3', name: 'M3 Bucket', dpd: '181+ DPD', color: '#6b7280', bg: '#f9fafb', icon: '💀' },
            { key: 'legal', name: 'Legal Cases', dpd: 'Court Cases', color: '#ffffff', bg: '#111827', icon: '⚖️' }
          ].map((bucket, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '20px 12px',
              background: bucket.bg,
              borderRadius: '8px',
              border: `1px solid ${bucket.name === 'Legal Cases' ? '#111827' : bucket.color}40`,
              cursor: 'pointer'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: bucket.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '14px',
                color: bucket.name === 'Legal Cases' ? '#111827' : '#ffffff'
              }}>
                {bucket.icon}
              </div>
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                margin: '0 0 8px', 
                color: bucket.name === 'Legal Cases' ? '#ffffff' : bucket.color 
              }}>
                {bucket.name}
              </h4>
              <p style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                margin: '0 0 4px', 
                color: bucket.name === 'Legal Cases' ? '#ffffff' : bucket.color 
              }}>
                {formatCurrency(dashboardData.buckets[bucket.key].amount)}
              </p>
              <p style={{ 
                fontSize: '10px', 
                margin: '0 0 8px', 
                color: bucket.name === 'Legal Cases' ? '#d1d5db' : bucket.color 
              }}>
                {dashboardData.buckets[bucket.key].count} accounts
              </p>
              <span style={{
                display: 'inline-block',
                padding: '2px 6px',
                background: bucket.name === 'Legal Cases' ? '#374151' : `${bucket.color}20`,
                color: bucket.name === 'Legal Cases' ? '#d1d5db' : bucket.color,
                fontSize: '9px',
                fontWeight: '600',
                borderRadius: '4px'
              }}>
                {bucket.dpd}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            margin: 0, 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Quick Actions
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Frequently used operations for daily tasks
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          
          {[
            { title: 'Update Payment', desc: 'Record new payments and allocations', color: '#3b82f6', icon: '💰' },
            { title: 'Overdue Loans', desc: 'View and manage overdue accounts', color: '#10b981', icon: '📋' },
            { title: 'Bank Match', desc: 'Reconcile bank statements', color: '#8b5cf6', icon: '🏦' },
            { title: 'Follow Up', desc: 'Schedule customer follow-ups', color: '#f59e0b', icon: '📞' }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => {
                if (action.title === 'Update Payment') setCurrentPage && setCurrentPage('payments');
                else if (action.title === 'Overdue Loans') setCurrentPage && setCurrentPage('overdue');
                else if (action.title === 'Bank Match') setCurrentPage && setCurrentPage('reconciliation');
                else if (action.title === 'Follow Up') setCurrentPage && setCurrentPage('overdue');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                background: action.color,
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <span style={{ fontSize: '24px', marginRight: '16px' }}>
                {action.icon}
              </span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                  {action.title}
                </p>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                  {action.desc}
                </p>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* Recent Activities */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginTop: '32px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            margin: 0, 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Recent Activities
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Latest customer interactions and system updates
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {dashboardData.recentActivities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: activity.type === 'payment' ? '#ecfdf5' : activity.type === 'followup' ? '#eff6ff' : '#fef2f2',
              borderRadius: '8px',
              border: `1px solid ${activity.type === 'payment' ? '#10b981' : activity.type === 'followup' ? '#3b82f6' : '#ef4444'}20`
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: activity.type === 'payment' ? '#10b981' : activity.type === 'followup' ? '#3b82f6' : '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                fontSize: '16px',
                color: 'white'
              }}>
                {activity.type === 'payment' ? '💰' : activity.type === 'followup' ? '📞' : '⚠️'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {activity.type === 'payment' ? 'Payment Received' : activity.type === 'followup' ? 'Follow-up Call' : 'Overdue Alert'}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                  {activity.customer} {activity.amount > 0 ? `- ${formatCurrency(activity.amount)}` : ''}
                </p>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/loans')
      .then(res => res.json())
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLoans = loans.filter(loan => {
    if (filter === 'active') return loan.status === 'active';
    if (filter === 'overdue') return new Date(loan.nextEMIDate) < new Date();
    return true;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Disbursed Loans</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
            <option value="all">All Loans</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
          </select>
          <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Loan</button>
        </div>
      </div>
      
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>Loan ID</div>
          <div>Customer</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Next EMI</div>
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>Loading loans...</div>
        ) : (
          filteredLoans.map(loan => (
            <div key={loan._id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontWeight: '600' }}>{loan.loanId || loan._id.slice(-6)}</div>
              <div>{loan.customerName || 'N/A'}</div>
              <div>₹{(loan.loanAmount || 0).toLocaleString()}</div>
              <div>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: loan.status === 'active' ? '#dcfce7' : '#fef2f2', color: loan.status === 'active' ? '#166534' : '#dc2626' }}>
                  {loan.status || 'Unknown'}
                </span>
              </div>
              <div>{loan.nextEMIDate ? new Date(loan.nextEMIDate).toLocaleDateString() : 'N/A'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const OverduePage = () => {
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/loans')
      .then(res => res.json())
      .then(data => {
        const overdue = data.filter(loan => new Date(loan.nextEMIDate) < new Date());
        setOverdueLoans(overdue);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Overdue Management</h1>
        <button style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Send Notices</button>
      </div>
      
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>Loan ID</div>
          <div>Customer</div>
          <div>Outstanding</div>
          <div>DPD</div>
          <div>Last Payment</div>
          <div>Action</div>
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>Loading overdue loans...</div>
        ) : (
          overdueLoans.map(loan => {
            const dpd = Math.floor((new Date() - new Date(loan.nextEMIDate)) / (1000 * 60 * 60 * 24));
            return (
              <div key={loan._id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
                <div style={{ fontWeight: '600' }}>{loan.loanId || loan._id.slice(-6)}</div>
                <div>{loan.customerName || 'N/A'}</div>
                <div>₹{(loan.outstandingAmount || 0).toLocaleString()}</div>
                <div>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: dpd > 90 ? '#fef2f2' : dpd > 30 ? '#fef3c7' : '#fef2f2', color: dpd > 90 ? '#dc2626' : dpd > 30 ? '#d97706' : '#dc2626' }}>
                    {dpd} days
                  </span>
                </div>
                <div>{loan.lastPaymentDate ? new Date(loan.lastPaymentDate).toLocaleDateString() : 'No payments'}</div>
                <div>
                  <button style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Follow Up</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ customerId: '', amount: '', paymentMode: 'UPI' });

  useEffect(() => {
    fetch('http://localhost:5000/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPayment, paymentDate: new Date() })
      });
      if (response.ok) {
        const payment = await response.json();
        setPayments([payment, ...payments]);
        setNewPayment({ customerId: '', amount: '', paymentMode: 'UPI' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Payment Processing</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Payment</button>
      </div>
      
      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Add New Payment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input placeholder="Customer ID" value={newPayment.customerId} onChange={(e) => setNewPayment({...newPayment, customerId: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            <input placeholder="Amount" type="number" value={newPayment.amount} onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            <select value={newPayment.paymentMode} onChange={(e) => setNewPayment({...newPayment, paymentMode: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleAddPayment} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Payment</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>Payment ID</div>
          <div>Customer</div>
          <div>Amount</div>
          <div>Mode</div>
          <div>Date</div>
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>Loading payments...</div>
        ) : (
          payments.map(payment => (
            <div key={payment._id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontWeight: '600' }}>{payment._id.slice(-6)}</div>
              <div>{payment.customerName || payment.customerId}</div>
              <div>₹{(payment.amount || 0).toLocaleString()}</div>
              <div>{payment.paymentMode || 'N/A'}</div>
              <div>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Customer Management</h1>
        <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Customer</button>
      </div>
      
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>Customer ID</div>
          <div>Name</div>
          <div>Phone</div>
          <div>Email</div>
          <div>Status</div>
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>Loading customers...</div>
        ) : (
          customers.map(customer => (
            <div key={customer._id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontWeight: '600' }}>{customer._id.slice(-6)}</div>
              <div>{`${customer.firstName} ${customer.lastName || ''}`.trim()}</div>
              <div>{customer.phone || 'N/A'}</div>
              <div>{customer.email || 'N/A'}</div>
              <div>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: customer.isActive ? '#dcfce7' : '#fef2f2', color: customer.isActive ? '#166534' : '#dc2626' }}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ReportsPage = () => {
  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>Reports & Analytics</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Collection Report</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>Daily, weekly, and monthly collection summaries</p>
          <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Generate Report</button>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Aging Analysis</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>Portfolio aging and bucket analysis</p>
          <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>View Analysis</button>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Performance Report</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>Team and individual performance metrics</p>
          <button style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Download Report</button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>Settings</h1>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>User Management</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add User</button>
            <button style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Manage Roles</button>
          </div>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>System Configuration</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Interest Rates</button>
            <button style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Penalty Rules</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageContent = ({ page, setCurrentPage }) => {
  switch(page) {
    case 'loans': return <LoansPage />;
    case 'overdue': return <OverduePage />;
    case 'payments': return <PaymentsPage />;
    case 'customers': return <CustomersPage />;
    case 'reports': return <ReportsPage />;
    case 'settings': return <SettingsPage />;
    case 'legal': return (
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Legal Cases</h1>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Legal case management system - Coming Soon</p>
        </div>
      </div>
    );
    case 'reconciliation': return (
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Bank Reconciliation</h1>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Bank reconciliation system - Coming Soon</p>
        </div>
      </div>
    );
    default: return <Dashboard setCurrentPage={setCurrentPage} />;
  }
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        <div style={{ 
          flex: 1, 
          background: '#f9fafb',
          minHeight: '100vh'
        }}>
          {/* Header */}
          <div style={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                color: '#374151'
              }}
            >
              ☰
            </button>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              margin: 0, 
              color: '#111827'
            }}>
              Loan Management CRM
            </h1>
          </div>
          
          <PageContent page={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
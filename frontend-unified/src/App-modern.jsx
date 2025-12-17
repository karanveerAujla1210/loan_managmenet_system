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
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              💼
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Loan CRM</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Collections System</p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1rem', height: 'calc(100vh - 140px)', overflowY: 'auto' }}>
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
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                background: currentPage === item.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: currentPage === item.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = '#f3f4f6';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = 'transparent';
                }
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
          padding: '1rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
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
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111' }}>Admin User</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>admin@loancrm.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              💼
            </div>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                margin: 0, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Loan Management CRM
              </h1>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Collections & Servicing Dashboard
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              {currentTime.toLocaleTimeString('en-IN', { hour12: true })}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: '500' }}>
                  Today's Collection
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '32px', fontWeight: 'bold', color: '#111' }}>
                  ₹2,45,000
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                  ↗ +12% from yesterday
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                💰
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: '500' }}>
                  Total Overdue
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '32px', fontWeight: 'bold', color: '#111' }}>
                  ₹15,67,890
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
                  234 active cases
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ⚠️
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: '500' }}>
                  Active Cases
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '32px', fontWeight: 'bold', color: '#111' }}>
                  234
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>
                  Follow-ups pending
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📋
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: '500' }}>
                  Target Achievement
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '32px', fontWeight: 'bold', color: '#111' }}>
                  87%
                </p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    width: '87%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎯
              </div>
            </div>
          </div>

        </div>

        {/* Bucket Analysis */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0, 
              color: '#111',
              marginBottom: '0.5rem'
            }}>
              DPD Bucket Analysis
            </h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Portfolio distribution by Days Past Due ranges
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '1rem' 
          }}>
            
            {[
              { name: 'Current', amount: '₹45L', accounts: '450', dpd: '0 DPD', color: '#10b981', bg: '#ecfdf5', icon: '✓' },
              { name: 'X Bucket', amount: '₹23L', accounts: '230', dpd: '1-30 DPD', color: '#f59e0b', bg: '#fffbeb', icon: '!' },
              { name: 'Y Bucket', amount: '₹18L', accounts: '180', dpd: '31-60 DPD', color: '#f97316', bg: '#fff7ed', icon: '⚠' },
              { name: 'M1 Bucket', amount: '₹12L', accounts: '120', dpd: '61-90 DPD', color: '#ef4444', bg: '#fef2f2', icon: '⚡' },
              { name: 'M2 Bucket', amount: '₹8L', accounts: '80', dpd: '91-180 DPD', color: '#8b5cf6', bg: '#faf5ff', icon: '🔥' },
              { name: 'M3 Bucket', amount: '₹5L', accounts: '50', dpd: '181+ DPD', color: '#6b7280', bg: '#f9fafb', icon: '💀' },
              { name: 'Legal Cases', amount: '₹3L', accounts: '25', dpd: 'Court Cases', color: '#ffffff', bg: '#111827', icon: '⚖️' }
            ].map((bucket, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '1.5rem 1rem',
                background: bucket.bg,
                borderRadius: '12px',
                border: `2px solid ${bucket.name === 'Legal Cases' ? '#111827' : bucket.color}20`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                }
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: bucket.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '16px',
                  color: bucket.name === 'Legal Cases' ? '#111827' : '#ffffff'
                }}>
                  {bucket.icon}
                </div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: '0 0 0.5rem', 
                  color: bucket.name === 'Legal Cases' ? '#ffffff' : bucket.color 
                }}>
                  {bucket.name}
                </h4>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  margin: '0 0 0.25rem', 
                  color: bucket.name === 'Legal Cases' ? '#ffffff' : bucket.color 
                }}>
                  {bucket.amount}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  margin: '0 0 0.75rem', 
                  color: bucket.name === 'Legal Cases' ? '#d1d5db' : bucket.color 
                }}>
                  {bucket.accounts} accounts
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  background: bucket.name === 'Legal Cases' ? '#374151' : `${bucket.color}20`,
                  color: bucket.name === 'Legal Cases' ? '#d1d5db' : bucket.color,
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '6px'
                }}>
                  {bucket.dpd}
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0, 
              color: '#111',
              marginBottom: '0.5rem'
            }}>
              Quick Actions
            </h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Frequently used operations for daily tasks
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem' 
          }}>
            
            {[
              { title: 'Update Payment', desc: 'Record new payments and allocations', color: '#3b82f6', icon: '💰' },
              { title: 'Overdue Loans', desc: 'View and manage overdue accounts', color: '#10b981', icon: '📋' },
              { title: 'Bank Match', desc: 'Reconcile bank statements', color: '#8b5cf6', icon: '🏦' },
              { title: 'Follow Up', desc: 'Schedule customer follow-ups', color: '#f59e0b', icon: '📞' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => alert(`${action.title} clicked!`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.5rem',
                  background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                  color: 'white',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span style={{ fontSize: '32px', marginRight: '1rem' }}>
                  {action.icon}
                </span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                    {action.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                    {action.desc}
                  </p>
                </div>
              </button>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

const PageContent = ({ page }) => {
  switch(page) {
    case 'loans':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Disbursed Loans</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Loan portfolio management and tracking system.</p>
          </div>
        </div>
      );
    case 'overdue':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Overdue Management</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Manage overdue accounts and follow-up activities.</p>
          </div>
        </div>
      );
    case 'payments':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Payment Processing</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Process payments and manage allocations.</p>
          </div>
        </div>
      );
    case 'legal':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Legal Cases</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Track legal proceedings and case management.</p>
          </div>
        </div>
      );
    case 'reconciliation':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Bank Reconciliation</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Reconcile bank statements and match transactions.</p>
          </div>
        </div>
      );
    case 'customers':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Customer Management</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Manage customer profiles and communication history.</p>
          </div>
        </div>
      );
    case 'reports':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Reports & Analytics</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>Generate reports and view analytics dashboards.</p>
          </div>
        </div>
      );
    case 'settings':
      return (
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Settings</h1>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '2rem' }}>
            <p>System configuration and user management.</p>
          </div>
        </div>
      );
    default:
      return <Dashboard />;
  }
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                color: '#374151'
              }}
              onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.background = 'none'}
            >
              ☰
            </button>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Loan Management CRM
            </h1>
          </div>
          
          <PageContent page={currentPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;

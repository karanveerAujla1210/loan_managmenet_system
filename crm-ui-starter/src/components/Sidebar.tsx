import React from 'react'
import tokens from '../theme/tokens'

export const Sidebar: React.FC = () => {
  const style: React.CSSProperties = {
    width: 260,
    background: tokens.colors.white,
    borderRight: `1px solid #E6E9EE`,
    padding: tokens.spacing.lg,
    minHeight: '100vh',
    boxSizing: 'border-box'
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: tokens.radii.small,
    color: tokens.colors.slate,
    marginBottom: 8
  }

  return (
    <aside style={style}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: tokens.typography.sizes.h3 }}>Loan CRM</div>
        <div style={{ color: tokens.colors.slate, fontSize: tokens.typography.sizes.small }}>Business Loans & Relief</div>
      </div>

      <nav>
        <div style={itemStyle}>Dashboard</div>
        <div style={itemStyle}>Customers</div>
        <div style={itemStyle}>Leads</div>
        <div style={itemStyle}>Loans</div>
        <div style={itemStyle}>Collections</div>
        <div style={itemStyle}>Reports</div>
      </nav>
    </aside>
  )
}

export default Sidebar

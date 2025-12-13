import React from 'react'
import tokens from '../theme/tokens'

const cardStyle: React.CSSProperties = {
  background: tokens.colors.white,
  borderRadius: tokens.radii.card,
  padding: tokens.spacing.md,
  boxShadow: tokens.shadows.subtle
}

export const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: tokens.spacing.xl }}>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing.md }}>
        <div style={cardStyle}>
          <div style={{ color: tokens.colors.slate }}>Total Customers</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>1,254</div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: tokens.colors.slate }}>Active Loans</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>3,412</div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: tokens.colors.slate }}>DPD > 30</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: tokens.colors.warning }}>$ 124,300</div>
        </div>
      </div>

      <section style={{ marginTop: tokens.spacing.lg }}>
        <div style={cardStyle}>
          <h3>Activity Feed</h3>
          <ul>
            <li>Lead assigned to Priya — 2h ago</li>
            <li>Payment received for Loan #LA-00123 — 4h ago</li>
            <li>Disbursement requested — 1d ago</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

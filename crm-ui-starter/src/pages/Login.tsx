import React, { useState } from 'react'
import { Button } from '../components/Button'
import tokens from '../theme/tokens'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const container: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: tokens.colors.neutralLight
  }

  const card: React.CSSProperties = {
    width: 420,
    background: tokens.colors.white,
    padding: tokens.spacing.xl,
    borderRadius: tokens.radii.card,
    boxShadow: tokens.shadows.elevated
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <p style={{ color: tokens.colors.slate }}>Sign in to continue to the CRM</p>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E6E9EE' }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E6E9EE' }} />
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input id="remember" type="checkbox" />
            <label htmlFor="remember" style={{ marginLeft: 8 }}>Remember me</label>
          </div>
          <a href="#" style={{ color: tokens.colors.primary }}>Forgot?</a>
        </div>

        <div style={{ marginTop: 18 }}>
          <Button style={{ width: '100%' }} onClick={() => login({ email, password })}>Sign in</Button>
        </div>
      </div>
    </div>
  )
}

export default Login

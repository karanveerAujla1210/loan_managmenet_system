import React from 'react'
import tokens from '../theme/tokens'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button: React.FC<Props> = ({ variant = 'primary', children, ...rest }) => {
  const style: React.CSSProperties = {
    background: variant === 'primary' ? tokens.colors.primary : 'transparent',
    color: variant === 'primary' ? tokens.colors.white : tokens.colors.slate,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    borderRadius: tokens.radii.small,
    border: variant === 'secondary' ? `1px solid ${tokens.colors.slate}` : 'none',
    boxShadow: tokens.shadows.subtle,
    cursor: 'pointer'
  }

  return (
    <button style={style} {...rest}>
      {children}
    </button>
  )
}

export default Button

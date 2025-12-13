import React from 'react'
import Button from '../Button'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export const PrimaryButton: React.FC<Props> = ({ children, loading, ...rest }) => {
  return (
    <Button
      variant="primary"
      disabled={rest.disabled || loading}
      style={{ width: rest.style?.width || undefined, opacity: loading ? 0.8 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : null}
      <span>{children}</span>
    </Button>
  )
}

export default PrimaryButton

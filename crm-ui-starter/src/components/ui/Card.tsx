import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  footer?: React.ReactNode
}

export const Card: React.FC<Props> = ({ title, footer, children, className = '', ...rest }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all ${className}`} {...rest}>
      {title && <div className="mb-4 text-lg font-semibold">{title}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  )
}

export default Card

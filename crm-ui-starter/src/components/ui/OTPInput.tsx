import React, { useRef } from 'react'

export const OTPInput: React.FC<{ length?: number; onChange?: (value: string) => void }> = ({ length = 6, onChange }) => {
  const refs = Array.from({ length }).map(() => useRef<HTMLInputElement | null>(null))

  const handleChange = (i: number, val: string) => {
    const next = refs[i + 1]
    if (val && next && next.current) next.current.focus()
    const value = refs.map((r) => r.current?.value || '').join('')
    onChange?.(value)
  }

  return (
    <div className="flex gap-2">
      {refs.map((r, i) => (
        <input
          key={i}
          ref={r}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center border border-gray-300 rounded-lg"
          onChange={(e) => handleChange(i, e.target.value)}
        />
      ))}
    </div>
  )
}

export default OTPInput

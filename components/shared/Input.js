import React from 'react'

export const Input = React.forwardRef(({ type = 'text', value, placeholder, onChange, onBlur, className = '', ...otherProps }, ref) => (
  <input
    {...otherProps}
    type={type}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    className={`${className} w-full`}
  />
))

Input.displayName = 'Input'

export default Input

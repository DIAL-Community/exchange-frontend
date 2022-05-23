import React from 'react'
import classNames from 'classnames'

export const Input = React.forwardRef(({ type = 'text', value, placeholder, onChange, onBlur, isInvalid = false, className, ...otherProps }, ref) => (
  <input
    {...otherProps}
    ref={ref}
    type={type}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    className={classNames({ 'validation-error': isInvalid }, className, 'w-full')}
  />
))

Input.displayName = 'Input'

export default Input

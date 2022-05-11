import React from 'react'

const Checkbox = React.forwardRef(({ type, value, onChange, onBlur, className = '', ...otherProps }, ref) => (
  <input
    {...otherProps}
    ref={ref}
    type='checkbox'
    checked={value}
    onChange={onChange}
    onBlur={onBlur}
    className={`${className} h-8 w-8`}
    data-testid='checkbox'
  />
))

Checkbox.displayName = 'Checkbox'

export default Checkbox

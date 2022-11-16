import React from 'react'
import classNames from 'classnames'

export const Textarea = React.forwardRef(({ value, placeholder, onChange, onBlur, isInvalid = false, className, ...otherProps }, ref) => (
  <textarea
    {...otherProps}
    ref={ref}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    className={classNames({ 'validation-error': isInvalid }, className, 'textarea w-full')}
  />
))

Textarea.displayName = 'Textarea'

export default Textarea

import React from 'react'
import classNames from 'classnames'

export const TextArea = React.forwardRef(
  (
    { value, placeholder, onChange, onBlur, isInvalid = false, className, ...otherProps },
    ref
  ) =>
    <textarea
      {...otherProps}
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={classNames({ 'validation-error': isInvalid }, className, 'textarea w-full')}
    />
)

TextArea.displayName = 'TextArea'

export default TextArea

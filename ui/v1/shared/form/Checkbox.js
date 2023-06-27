import React from 'react'
import classNames from 'classnames'

const Checkbox = React.forwardRef(({ value, onChange, onBlur, className, ...otherProps }, ref) => (
  <input
    {...otherProps}
    ref={ref}
    type='checkbox'
    checked={value}
    onChange={onChange}
    onBlur={onBlur}
    className={classNames(className, 'h-6 w-6')}
    data-testid='checkbox'
  />
))

Checkbox.displayName = 'Checkbox'

export default Checkbox

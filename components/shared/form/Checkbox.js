import { forwardRef } from 'react'
import classNames from 'classnames'

const Checkbox = forwardRef(({ value, onChange, onBlur, className, ...otherProps }, ref) => (
  <input
    {...otherProps}
    ref={ref}
    type='checkbox'
    checked={value}
    onChange={onChange}
    onBlur={onBlur}
    className={classNames(className, 'h-5 w-5')}
  />
))

Checkbox.displayName = 'Checkbox'

export default Checkbox

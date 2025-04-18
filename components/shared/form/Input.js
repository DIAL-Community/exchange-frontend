import { forwardRef } from 'react'
import classNames from 'classnames'

export const Input = forwardRef(
  (
    {
      type = 'text',
      value,
      placeholder,
      onChange,
      onBlur,
      isInvalid = false,
      className,
      ...otherProps
    },
    ref
  ) =>
    <input
      {...otherProps}
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={classNames({ 'validation-error': isInvalid }, className, 'w-full text-sm')}
    />
)

Input.displayName = 'Input'

export default Input

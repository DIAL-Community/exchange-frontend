import React from 'react'
import classNames from 'classnames'

const URL_PREFIX = 'https://'
const URL_PROTOCOL_REGEX = /^https?:\/{2}/i

export const UrlInput = React.forwardRef(
  (
    { value, onChange, isInvalid = false, className, placeholder, ...otherProps },
    ref
  ) =>
    <div
      className={classNames(
        { 'validation-error': isInvalid },
        className,
        'border border-transparent',
        'url-input bg-white flex items-center'
      )}
    >
      {value && (
        <span className='select-none text-dial-gray'>
          {URL_PREFIX}
        </span>
      )}
      <input
        {...otherProps}
        ref={ref}
        value={value}
        onChange={event => onChange(event.target.value?.replace(URL_PROTOCOL_REGEX, ''))}
        placeholder={placeholder}
        className='url w-full placeholder-dial-gray focus:outline-0'
      />
    </div>
)

UrlInput.displayName = 'UrlInput'

export default UrlInput

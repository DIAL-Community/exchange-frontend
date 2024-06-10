import React from 'react'
import classNames from 'classnames'

const URL_PREFIX = 'https://'
const URL_PROTOCOL_REGEX = /^https?:\/{2}/i

const TELEPHONY_PREFIX = 'tel:'
const TELEPHONY_REGEX = /^tel:\d{10}$/i

export const UrlInput = React.forwardRef(
  ({ value, onChange, isInvalid = false, className, placeholder, isTelephony, ...otherProps }, ref) =>
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
          {isTelephony ? TELEPHONY_PREFIX : URL_PREFIX}
        </span>
      )}
      <input
        {...otherProps}
        ref={ref}
        value={value}
        onChange={event =>
          onChange(event.target.value?.replace(isTelephony ? TELEPHONY_REGEX : URL_PROTOCOL_REGEX, ''))
        }
        placeholder={placeholder}
        className='url w-full text-sm placeholder-dial-gray border-0 py-0 px-0 focus:outline-0'
      />
    </div>
)

UrlInput.displayName = 'UrlInput'

export default UrlInput

import React from 'react'
import { ImFilePicture } from 'react-icons/im'
import classNames from 'classnames'

const FileUploader = React.forwardRef(({ onChange, onBlur, isInvalid = false, className, ...otherProps }, ref) => {
  // when used in React Hook Form, to pass a list of selected files a custom 'onChange' function has to be used
  // however, to keep the value uncontrolled the 'value' property has to be omitted in props passed to input of type 'file'
  // https://github.com/react-hook-form/react-hook-form/issues/3025
  const { value, ...otherPropsWithoutValue } = otherProps // eslint-disable-line

  return (
    <label className={classNames(className, 'flex items-center')}>
      <input
        {...otherPropsWithoutValue}
        ref={ref}
        type='file'
        onChange={onChange}
        onBlur={onBlur}
        className={classNames({ 'validation-error': isInvalid }, 'bg-white file:hidden w-full pr-10')}
        data-testid='file-uploader'
      />
      <div className='-ml-11 flex p-1'>
        <span className='h-full pl-1 border-l text-3xl text-dial-gray-dark border-dial-gray-dark'>
          <ImFilePicture />
        </span>
      </div>
    </label>
  )
})

FileUploader.displayName = 'FileUploader'

export default FileUploader

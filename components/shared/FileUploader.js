import React from 'react'
import { ImFilePicture } from 'react-icons/im'

const FileUploader = React.forwardRef(({ type, value, placeholder, onChange, onBlur, className = '', ...otherProps }, ref) => (
  <div className={`${className} flex items-center`}>
    <input
      {...otherProps}
      ref={ref}
      type='file'
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className='bg-white file:hidden w-full pr-10'
      data-testid='file-uploader'
    />
    <div className='-ml-11 flex p-1'>
      <span className='h-full pl-1 border-l text-3xl text-dial-gray-dark border-dial-gray-dark'>
        <ImFilePicture />
      </span>
    </div>
  </div>
))

FileUploader.displayName = 'FileUploader'

export default FileUploader

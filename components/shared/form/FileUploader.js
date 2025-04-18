import { forwardRef, useCallback } from 'react'
import classNames from 'classnames'
import { ImFilePicture } from 'react-icons/im'
import { useIntl } from 'react-intl'

const FileUploader = forwardRef(({ onChange, onBlur, isInvalid = false, className, ...otherProps }, ref) => {
  // https://github.com/react-hook-form/react-hook-form/issues/3025
  const { fileTypes, fileTypesDisclaimer, ...otherPropsWithoutValue } = otherProps

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <label className={classNames(className, 'flex items-center')}>
        <input
          {...otherPropsWithoutValue}
          ref={ref}
          type='file'
          onChange={onChange}
          onBlur={onBlur}
          className={classNames({ 'validation-error': isInvalid }, 'bg-white file:hidden w-full text-sm')}
          accept={fileTypes ? fileTypes : '.jpg,.jpeg,.png,.bmp'}
        />
        <div className='-ml-11 flex p-1'>
          <span className='h-full pl-1 border-l text-dial-gray-dark border-dial-gray-dark'>
            <ImFilePicture />
          </span>
        </div>
      </label>
      <div className='text-xs italic text-dial-stratos'>
        {fileTypesDisclaimer ? format(fileTypesDisclaimer) : format('logo.supportedFormats')}
      </div>
    </>
  )
})

FileUploader.displayName = 'FileUploader'

export default FileUploader

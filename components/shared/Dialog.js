import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Dialog as DialogHeadlessui, Transition } from '@headlessui/react'
import { Fragment, useRef } from 'react'
import classNames from 'classnames'

export const DialogType = {
  FORM: 'form',
  DETAILS: 'details'
}

const Dialog = ({
  children,
  isSubmitInProgress,
  formId,
  isOpen,
  onClose,
  submitButton,
  cancelButton,
  closeButton,
  dialogType = DialogType.DETAILS
}) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const initialFocusRef = useRef(null)

  return (
    <Transition appear show={isOpen} as={Fragment} data-testid='dialog'>
      <DialogHeadlessui initialFocus={initialFocusRef} as='div' className='fixed z-100' onClose={onClose} >
        <div className="fixed inset-0 bg-dial-gray opacity-80" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <DialogHeadlessui.Panel
              className={classNames({
                'max-h-screen w-screen md:w-3/5 lg:w-3/5 xl:w-1/2 p-8': dialogType === DialogType.FORM,
                'w-4/5 sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/6 p-2 sm:p-4': dialogType === DialogType.DETAILS
              }, 'transform bg-white shadow-xl rounded-2xl flex flex-col')}>
              <DialogHeadlessui.Description
                as='div'
                className={classNames({
                  'bg-edit': dialogType === DialogType.FORM,
                  'bg-white': dialogType === DialogType.DETAILS
                }, 'overflow-auto py-4 px-8 flex flex-col gap-3')}
              >
                <div className='flex justify-start text-xl' data-testid='dialog-body'>
                  {children}
                </div>
                <div className='flex justify-start gap-3 text-xl' >
                  {submitButton && (
                    <button
                      type='submit'
                      form={formId}
                      className='submit-button'
                      disabled={isSubmitInProgress}
                      data-testid='submit-button'
                    >
                      {format(`${isSubmitInProgress ? 'app.submitting' : 'app.submit'}`)}
                      {isSubmitInProgress && <FaSpinner className='spinner ml-3 inline' data-testid='submit-spinner' />}
                    </button>
                  )}
                  {cancelButton && (
                    <button
                      ref={initialFocusRef}
                      type='button'
                      onClick={onClose}
                      className='cancel-button'
                      disabled={isSubmitInProgress}
                      data-testid='cancel-button'
                    >
                      {format('app.cancel')}
                    </button>
                  )}
                </div>
                {closeButton && (
                  <div className='flex justify-end text-xl' >
                    <button
                      ref={initialFocusRef}
                      type='button'
                      onClick={onClose}
                      className='close-button'
                      disabled={isSubmitInProgress}
                      data-testid='close-button'
                    >
                      {format('app.close')}
                    </button>
                  </div>
                )}
              </DialogHeadlessui.Description>
            </DialogHeadlessui.Panel>
          </Transition.Child>
        </div>
      </DialogHeadlessui>
    </Transition>
  )
}

export default Dialog

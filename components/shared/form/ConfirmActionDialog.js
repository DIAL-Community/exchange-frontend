import { useCallback, useRef } from 'react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const ConfirmActionDialog = ({ title, message, isOpen, onClose, onConfirm, isConfirming }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  // Dialog should contain at least one focusable element - documentation of @headlessui/react
  let initialFocusRef = useRef(null)

  return (
    <Transition appear show={isOpen}>
      <Dialog initialFocus={initialFocusRef} as='div' className='fixed z-100' onClose={onClose} >
        <div className='fixed inset-0 bg-dial-gray opacity-80' aria-hidden='true' />
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <TransitionChild
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel
              className={classNames(
                'inline-block w-4/5 md:w-3/5 xl:w-3/5 p-8 max-w-prose',
                'transform bg-white shadow-xl rounded-2xl'
              )}
            >
              <DialogTitle
                className='text-lg font-semibold pb-3 text-dial-sapphire'
              >
                {title}
              </DialogTitle>
              <span className='flex flex-col pb-3 text-sm'>
                {message}
              </span>
              <div className='flex justify-center sm:justify-end gap-3'>
                <button
                  type='button'
                  className='submit-button'
                  onClick={onConfirm}
                  disabled={isConfirming}
                >
                  {format('app.confirm')}
                  {isConfirming && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  ref={initialFocusRef}
                  type='button'
                  className='cancel-button'
                  onClick={onClose}
                >
                  {format('app.cancel')}
                </button>
              </div>
            </Dialog.Panel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConfirmActionDialog

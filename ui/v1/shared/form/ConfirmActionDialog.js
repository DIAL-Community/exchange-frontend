import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useCallback, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'

const ConfirmActionDialog = ({ title, message, isOpen, onClose, onConfirm, isConfirming }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  // Dialog should contain at least one focusable element - documentation of @headlessui/react
  let initialFocusRef = useRef(null)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog initialFocus={initialFocusRef} as='div' className='fixed z-100' onClose={onClose} >
        <div className="fixed inset-0 bg-dial-gray opacity-80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel
              className={classNames(
                'inline-block w-4/5 md:w-3/5 xl:w-3/5 xl:w-1/2 p-8 max-w-prose',
                'transform bg-white shadow-xl rounded-2xl'
              )}
            >
              <Dialog.Title className='text-lg font-semibold pb-3 text-dial-sapphire'>
                {title}
              </Dialog.Title>
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
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConfirmActionDialog

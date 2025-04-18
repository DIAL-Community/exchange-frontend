import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

// Dialog for the widget options.
const ItemOptionsDialog = ({ title, show, onClose, children }) => {
  return (
    <Transition appear show={show}>
      <Dialog
        as='div'
        className='fixed inset-0 z-100 overflow-y-auto'
        onClose={() => { }}
      >
        <div className='min-h-screen px-4 text-center'>
          <div className='fixed inset-0 bg-dial-gray opacity-40' />
          <DialogPanel>
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <TransitionChild
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={classNames(
                  'inline-block w-full max-w-3xl px-8 py-6 text-left',
                  'transition-all transform bg-white shadow-xl rounded'
                )}
              >
                <DialogTitle>
                  <div className='pb-4 font-semibold'>
                    {title}
                  </div>
                </DialogTitle>
                <div className='flex flex-col gap-y-3'>
                  {children}
                  <div className='flex justify-end text-xs text-white mt-2'>
                    <button className='bg-dial-sapphire px-3 py-2 rounded' onClick={onClose}>
                      <FormattedMessage id='app.save' />
                    </button>
                  </div>
                </div>
              </div>
            </TransitionChild>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ItemOptionsDialog

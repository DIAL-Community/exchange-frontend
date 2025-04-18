import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Description, Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const ComingSoon = ({ showForm, hideFeedbackForm }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <Transition appear show={showForm}>
        <Dialog
          as='div'
          className='fixed inset-0 z-100 overflow-y-auto'
          onClose={hideFeedbackForm}
        >
          <div className='min-h-screen px-4 text-center'>
            <TransitionChild
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-dial-gray opacity-80' />
            </TransitionChild>
            <span className='inline-block h-screen align-middle' aria-hidden='true'>
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
                className={`
                  inline-block w-full max-w-6xl p-6 my-8 overflow-hidden
                  text-left align-middle transition-all transform bg-white
                  shadow-xl rounded-2xl
                `}
              >
                <DialogTitle>
                  <div className='flex gap-3 px-2'>
                    <div className='font-semibold text-2xl py-3 text-dial-sapphire'>
                      Coming Soon
                    </div>
                  </div>
                </DialogTitle>
                <Description>
                  <div className='ml-auto grid grid-cols-1 gap-3 py-3 px-2 text-dial-sapphire'>
                    This feature is under development and will be available for users in the coming weeks
                    <div className='flex gap-3'>
                      <button type='button' className='secondary-button dial-sapphire' onClick={hideFeedbackForm}>
                        {format('general.close')}
                      </button>
                    </div>
                  </div>
                </Description>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ComingSoon

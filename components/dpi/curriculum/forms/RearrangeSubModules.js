import { Fragment, useCallback, useContext, useState } from 'react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { UPDATE_PLAY_MOVES } from '../../../shared/mutation/play'
import { DraggableContext, DraggableContextProvider } from './DraggableContext'
import DraggableSubModules from './DraggableSubModules'

const RearrangeSubModules = ({ displayRearrangeDialog, onRearrangeDialogClose, module }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Transition appear show={displayRearrangeDialog} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-100 overflow-y-auto'
        onClose={onRearrangeDialogClose}
      >
        <div className='min-h-screen px-4 text-center'>
          <Dialog.Overlay className='fixed inset-0 bg-dial-gray opacity-40' />
          <span
            className='inline-block h-screen align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div
              className={classNames(
                'inline-block w-full max-w-6xl px-4 pt-4 pb-8 overflow-hidden text-left align-middle',
                'transition-all transform bg-white shadow-xl rounded-2xl'
              )}
            >
              <Dialog.Title>
                <div className='px-4 text-xl text-dial-sapphire font-semibold'>
                  <div className='pt-3 pb-5 border-b border-dashed'>
                    {format('ui.move.rearrange')}
                  </div>
                </div>
              </Dialog.Title>
              <DraggableContextProvider>
                <div className='flex flex-col gap-4 px-4 pt-6'>
                  <DraggableSubModules module={module} />
                  <RearrangeControls module={module} onClose={onRearrangeDialogClose} />
                </div>
              </DraggableContextProvider>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const RearrangeControls = ({ module, onClose }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  const { dirty, setDirty, currentSubModules } = useContext(DraggableContext)
  const { showToast } = useContext(ToastContext)

  const [updatePlayMoves, { reset }] = useMutation(
    UPDATE_PLAY_MOVES, {
      onCompleted: (data) => {
        const { updatePlayMoves: response } = data
        if (response?.play && response?.errors?.length === 0) {
          setDirty(false)
          setLoading(false)
          showToast(format('toast.move.rearrange.success'), 'success', 'top-center')
        } else {
          setDirty(false)
          setLoading(false)
          showToast(format('toast.move.rearrange.failure'), 'error', 'top-center')
          reset()
        }
      },
      onError: () => {
        setDirty(false)
        setLoading(false)
        showToast(format('toast.move.rearrange.failure'), 'error', 'top-center')
        reset()
      }
    }
  )

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updatePlayMoves({
        variables: {
          slug: module.slug,
          moveSlugs: currentSubModules.map(({ slug }) => slug)
        },
        context: {
          headers: {
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  return (
    <div className='flex gap-3 ml-auto'>
      <button
        type='button'
        onClick={() => {
          setLoading(true)
          onSubmit()
        }}
        className='submit-button'
        disabled={loading || !dirty}
      >
        {format('app.save')}
        {loading && <FaSpinner className='spinner ml-3 inline' />}
      </button>
      <button
        type='button'
        className='cancel-button'
        onClick={onClose}
      >
        {format('app.close')}
      </button>
    </div>
  )
}

export default RearrangeSubModules

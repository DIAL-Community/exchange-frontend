import { Fragment, useCallback, useContext, useState } from 'react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import { useActiveTenant, useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { PlayFilterContext, PlayFilterDispatchContext, PlayFilterProvider } from '../context/PlayFilterContext'
import { SearchInput } from '../shared/form/SearchInput'
import { UPDATE_PLAYBOOK_PLAYS } from '../shared/mutation/playbook'
import { PLAYS_QUERY } from '../shared/query/play'
import { PlayListContext, PlayListDispatchContext, PlayListProvider } from './context/PlayListContext'
import PlayListQuery from './PlayList'
import PlayListDraggable from './PlayListDraggable'

const RearrangePlay = ({ displayDragable, onDragableClose, playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Transition appear show={displayDragable} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-100 overflow-y-auto'
        onClose={onDragableClose}
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
                    {format('ui.play.rearrange')}
                  </div>
                </div>
              </Dialog.Title>
              <PlayFilterProvider>
                <PlayListProvider>
                  <div className='flex flex-col gap-4 px-4 pt-6'>
                    <PlayListDraggable playbook={playbook} />
                    <RearrangeControls playbook={playbook} onClose={onDragableClose} />
                    <ExistingPlay />
                  </div>
                </PlayListProvider>
              </PlayFilterProvider>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const ExistingPlay = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showPlayForm, setShowPlayForm] = useState(false)

  const { search } = useContext(PlayFilterContext)
  const { setSearch } = useContext(PlayFilterDispatchContext)

  const handleChange = (e) => setSearch(e.target.value)

  return (
    <>
      {showPlayForm &&
        <div className='flex flex-col gap-3 mt-3'>
          <div className='flex flex-wrap gap-2 ml-auto'>
            <span className='sr-only'>{format('search.input.label')}</span>
            <SearchInput
              value={search}
              onChange={handleChange}
              className='w-56 2xl:w-96'
              placeholder={`${format('app.search')} ${format('ui.play.header')}`}
            />
          </div>
          <div className='border-b' />
          <PlayListQuery />
        </div>
      }
      {!showPlayForm &&
        <div className='font-semibold text-sm ml-auto'>
          <button
            type='button'
            className='cancel-button'
            onClick={() => { setShowPlayForm(true) }}
          >
            {format('ui.play.assignExistingPlay')}
          </button>
        </div>
      }
    </>
  )
}

const RearrangeControls = ({ playbook, onClose }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const { user } = useUser()
  const { tenant } = useActiveTenant()

  const { dirty, currentPlays } = useContext(PlayListContext)
  const { setDirty } = useContext(PlayListDispatchContext)
  const { showFailureMessage, showSuccessMessage } = useContext(ToastContext)

  const [updatePlayMoves, { reset }] = useMutation(
    UPDATE_PLAYBOOK_PLAYS, {
      refetchQueries: [{
        query: PLAYS_QUERY,
        variables: { playbookSlug: playbook.slug, owner: tenant }
      }],
      onCompleted: (data) => {
        const { updatePlaybookPlays: response } = data
        if (response?.playbook && response?.errors?.length === 0) {
          setDirty(false)
          setLoading(false)
          showSuccessMessage(format('toast.play.rearrange.success'))
        } else {
          reset()
          setDirty(false)
          setLoading(false)
          showFailureMessage(format('toast.play.rearrange.failure'))
        }
      },
      onError: () => {
        reset()
        setDirty(false)
        setLoading(false)
        showFailureMessage(format('toast.play.rearrange.failure'))
      }
    }
  )

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updatePlayMoves({
        variables: {
          slug: playbook.slug,
          playSlugs: currentPlays.map(({ slug }) => slug),
          owner: tenant
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
    <div className='flex flex-row gap-3 text-sm ml-auto'>
      <button
        type='button'
        className='submit-button'
        onClick={() => {
          setLoading(true)
          onSubmit()
        }}
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

export default RearrangePlay

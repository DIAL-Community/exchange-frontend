import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa'
import {
  PlayFilterContext,
  PlayFilterDispatchContext,
  PlayFilterProvider
} from '../../../components/context/PlayFilterContext'
import { TagActiveFilters, TagAutocomplete } from '../shared/filter/Tag'
import { SearchInput } from '../shared/form/SearchInput'
import { ToastContext } from '../../../lib/ToastContext'
import { UPDATE_PLAYBOOK_PLAYS } from '../shared/mutation/playbook'
import { useUser } from '../../../lib/hooks'
import {
  PlayListContext,
  PlayListDispatchContext,
  PlayListProvider
} from './context/PlayListContext'
import PlayListDraggable from './PlayListDraggable'
import PlayListQuery from './PlayList'

const RearrangePlay = ({ displayDragable, onDragableClose, playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Transition appear show={displayDragable} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 overflow-y-auto"
        onClose={onDragableClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-dial-gray opacity-40" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
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
                    <ExistingPlay playbook={playbook} />
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

const ExistingPlay = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showPlayForm, setShowPlayForm] = useState(false)

  const { search, tags } = useContext(PlayFilterContext)
  const { setSearch, setTags } = useContext(PlayFilterDispatchContext)

  const handleChange = (e) => setSearch(e.target.value)

  return (
    <>
      {showPlayForm &&
        <div className='flex flex-col gap-3 mt-3'>
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-wrap gap-2 ml-auto'>
              <TagAutocomplete
                isSearch
                tags={tags}
                setTags={setTags}
                containerStyles='w-56 2xl:w-96'
              />
              <span className='sr-only'>{format('search.input.label')}</span>
              <SearchInput
                value={search}
                onChange={handleChange}
                className='w-56 2xl:w-96'
                placeholder={`${format('app.search')} ${format('ui.play.header')}`}
              />
            </div>
            <div className='flex flex-row flex-wrap gap-3 ml-auto'>
              <TagActiveFilters tags={tags} setTags={setTags} />
            </div>
          </div>
          <div className='border-b' />
          <PlayListQuery playbook={playbook} />
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

  const { dirty, currentPlays } = useContext(PlayListContext)
  const { setDirty } = useContext(PlayListDispatchContext)
  const { showToast } = useContext(ToastContext)

  const [updatePlayMoves, { reset }] = useMutation(
    UPDATE_PLAYBOOK_PLAYS, {
      onCompleted: (data) => {
        const { updatePlaybookPlays: response } = data
        if (response?.playbook && response?.errors?.length === 0) {
          setDirty(false)
          setLoading(false)
          showToast(format('toast.play.rearrange.success'), 'success', 'top-center')
        } else {
          setDirty(false)
          setLoading(false)
          showToast(format('toast.play.rearrange.failure'), 'error', 'top-center')
          reset()
        }
      },
      onError: () => {
        setDirty(false)
        setLoading(false)
        showToast(format('toast.play.rearrange.failure'), 'error', 'top-center')
        reset()
      }
    }
  )

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updatePlayMoves({
        variables: {
          slug: playbook.slug,
          playSlugs: currentPlays.map(({ slug }) => slug)
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

export default RearrangePlay

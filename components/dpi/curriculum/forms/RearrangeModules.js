import { Fragment, useCallback, useContext, useState } from 'react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { FilterContext } from '../../../context/FilterContext'
import { SearchInput } from '../../../shared/form/SearchInput'
import { UPDATE_PLAYBOOK_PLAYS } from '../../../shared/mutation/playbook'
import { PLAYS_QUERY } from '../../../shared/query/play'
import { DPI_TENANT_NAME } from '../../constants'
import { DraggableContext, DraggableContextProvider } from './DraggableContext'
import DraggableModules from './DraggableModules'
import ExistingModuleList from './ExistingModuleList'

const RearrangeModules = ({ displayRearrangeDialog, onRearrangeDialogClose, curriculum }) => {
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
                <div className='px-4 text-xl font-semibold'>
                  <div className='pt-3 pb-5 border-b border-dashed'>
                    {format('ui.play.rearrange')}
                  </div>
                </div>
              </Dialog.Title>
              <DraggableContextProvider>
                <div className='flex flex-col gap-4 px-4 pt-6'>
                  <DraggableModules curriculum={curriculum} />
                  <RearrangeControls curriculum={curriculum} onClose={onRearrangeDialogClose} />
                  <ExistingModule />
                </div>
              </DraggableContextProvider>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const ExistingModule = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showModuleForm, setShowModuleForm] = useState(false)
  const { search, setSearch } = useContext(FilterContext)

  const handleChange = (e) => setSearch(e.target.value)

  return (
    <>
      {showModuleForm &&
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
          <ExistingModuleList />
        </div>
      }
      {!showModuleForm &&
        <div className='font-semibold text-sm ml-auto'>
          <button
            type='button'
            className='cancel-button'
            onClick={() => { setShowModuleForm(true) }}
          >
            {format('ui.play.assignExistingPlay')}
          </button>
        </div>
      }
    </>
  )
}

const RearrangeControls = ({ curriculum, onClose }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  const { dirty, setDirty, currentModules } = useContext(DraggableContext)
  const { showFailureMessage, showSuccessMessage } = useContext(ToastContext)

  const [updateModules, { reset }] = useMutation(
    UPDATE_PLAYBOOK_PLAYS, {
      refetchQueries: [{
        query: PLAYS_QUERY,
        variables: { playbookSlug: curriculum.slug, owner: DPI_TENANT_NAME }
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

      updateModules({
        variables: {
          slug: curriculum.slug,
          owner: DPI_TENANT_NAME,
          playSlugs: currentModules.map(({ slug }) => slug)
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

export default RearrangeModules

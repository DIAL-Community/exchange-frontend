import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { FaSpinner } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'
import { ToastContext } from '../../../../lib/ToastContext'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../../../../components/context/PlaybookFilterContext'
import { APPLY_AS_CONTENT_EDITOR } from '../../shared/mutation/playbook'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { useUser } from '../../../../lib/hooks'

const PlaybookFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale }  = useRouter()
  const [loading, setLoading] = useState(false)

  const { tags, products } = useContext(PlaybookFilterContext)
  const { setTags, setProducts } = useContext(PlaybookFilterDispatchContext)

  const { showFailureMessage, showSuccessMessage } = useContext(ToastContext)

  const filteringPlaybook = () => {
    return tags.length + products.length > 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setProducts([])
    setTags([])
  }

  const [applyAsContentEditor, { reset }] = useMutation(APPLY_AS_CONTENT_EDITOR, {
    refetchQueries: ['CandidateRole'],
    onCompleted: (data) => {
      const { applyAsContentEditor: response } = data
      if (!response?.candidateRole || response?.errors?.length > 0) {
        const [errorMessage] = response.errors
        showFailureMessage(errorMessage)
        setLoading(false)
        reset()
      } else {
        showSuccessMessage(format('toast.applyAsContentEditor.submit.success'))
        setLoading(false)
        reset()
      }
    },
    onError: (error) => {
      showFailureMessage(error?.message)
      setLoading(false)
      reset()
    }
  })

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user
      setLoading(true)

      applyAsContentEditor({
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringPlaybook() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button type='button' onClick={clearFilter}>
                {format('ui.filter.clearAll')}
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <TagActiveFilters tags={tags} setTags={setTags} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
      {!user &&
        <div className='text-xs text-dial-sapphire'>
          <a href='#' onClick={signIn} className='flex'>
            <div className='border-b border-dial-sunshine'>
              {format('ui.playbook.hint.createPlaybooks')}
            </div>
          </a>
        </div>
      }
      {user && !user.isEditorUser && !user.isAdminUser &&
        <div className='text-xs text-dial-sapphire flex flex-wrap gap-0.5'>
          <a
            href='#'
            className='border-b border-dial-sunshine'
            onClick={onSubmit}
            disabled={loading}
          >
            {loading && <FaSpinner className='inline spinner mr-1' />}
            {format('contentEditor.apply')}
          </a>
          <div className='inline border-b border-transparent'>
            {format('contentEditor.privilege')}
          </div>
        </div>
      }
    </div>
  )
}

export default PlaybookFilter

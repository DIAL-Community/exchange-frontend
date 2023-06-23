import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_USE_CASE_TAGS } from '../../shared/mutation/useCase'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { TAG_SEARCH_QUERY } from '../../shared/query/tag'

const UseCaseDetailTags = ({ useCase, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [tags, setTags] = useState(useCase.tags)
  const [isDirty, setIsDirty] = useState(false)

  const { showToast } = useContext(ToastContext)

  const [updateUseCaseTags, { data, loading, reset }] = useMutation(UPDATE_USE_CASE_TAGS, {
    onError: () => {
      setIsDirty(false)
      setTags(useCase.tags)
      showToast(format('toast.tags.update.failure'), 'error', 'top-center')
    },
    onCompleted: (data) => {
      const { updateUseCaseTags: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setIsDirty(false)
        setTags(response?.useCase?.tags)
        showToast(format('toast.tags.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setTags(useCase.tags)
        showToast(format('toast.tags.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const fetchedTagsCallback = (data) => data.tags?.map(({ name: label }) => ({ label }))

  const addTag = (tag) => {
    setTags([...tags.filter(label => label !== tag.label), tag.label])
    setIsDirty(true)
  }

  const removeTag = (tag) => {
    setTags([...tags.filter(label => label !== tag)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseTags({
        variables: {
          slug: useCase.slug,
          tags
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setTags(data?.updateUseCaseTags?.useCase?.tags ?? useCase.tags)
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry'>
      {format('ui.useCase.detail.sdgTargets')}
    </div>

  const displayModeBody = tags.length
    ? (
      <div className='italic text-sm'>
        {tags.join(', ')}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('ui.useCase.detail.noData', { entity: format('ui.tag.label') })}
      </div>
    )

  const editModeBody =
    <div className='px-8 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('tag.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, TAG_SEARCH_QUERY, fetchedTagsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('tag.header') })}
          onChange={addTag}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {tags.map((tag, tagIdx) => (
          <Pill
            key={`tag-${tagIdx}`}
            label={tag}
            onRemove={() => removeTag(tag)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default UseCaseDetailTags

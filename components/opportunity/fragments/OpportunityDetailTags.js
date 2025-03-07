import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_OPPORTUNITY_TAGS } from '../../shared/mutation/opportunity'
import { TAG_SEARCH_QUERY } from '../../shared/query/tag'
import { fetchSelectOptions } from '../../utils/search'

const OpportunityDetailTags = ({ opportunity, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [tags, setTags] = useState(opportunity.tags)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOpportunityTags, { loading, reset }] = useMutation(UPDATE_OPPORTUNITY_TAGS, {
    onError: () => {
      setIsDirty(false)
      setTags(opportunity.tags)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.tag.header') }))
    },
    onCompleted: (data) => {
      const { updateOpportunityTags: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        setIsDirty(false)
        setTags(response?.opportunity?.tags)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.tag.header') }))
      } else {
        setIsDirty(false)
        setTags(opportunity.tags)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.tag.header') }))
        reset()
      }
    }
  })

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
    updateOpportunityTags({
      variables: {
        slug: opportunity.slug,
        tagNames: tags
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setTags(opportunity.tags)
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.tag.header')}
    </div>

  const displayModeBody = tags.length
    ? <div className='italic text-sm'>
      {tags.join(', ')}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', {
        entity: format('ui.tag.label'),
        base: format('ui.opportunity.label')
      })}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('tag.header')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, TAG_SEARCH_QUERY, fetchedTagsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('tag.header') })}
          onChange={addTag}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
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
      editingAllowed={editingAllowed}
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

export default OpportunityDetailTags

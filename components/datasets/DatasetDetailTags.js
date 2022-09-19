import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_DATASET_TAGS } from '../../mutations/dataset'
import { fetchSelectOptions } from '../../queries/utils'
import TagCard from '../tags/TagCard'
import { TAG_SEARCH_QUERY } from '../../queries/tag'

const DatasetDetailTags = ({ dataset, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [tagNames, setTagNames] = useState(dataset.tags)
  const [isDirty, setIsDirty] = useState(false)

  const [updateDatasetTags, { data, loading }] = useMutation(UPDATE_DATASET_TAGS)

  const { data: session } = useSession()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateDatasetTags?.errors.length === 0 && data?.updateDatasetTags?.dataset) {
      setTagNames(data.updateDatasetTags.dataset.tags)
      showToast(format('dataset.tags.updated'), 'success', 'top-center')
      setIsDirty(false)
    }
  }, [data, showToast, format])

  const fetchedTagsCallback = (data) => (
    data.tags.map((tag) => ({
      label: tag.name,
      value: tag.id,
      slug: tag.slug
    }))
  )

  const addTag = (tag) => {
    setTagNames([...tagNames.filter(tagName => tagName !== tag.name), tag.label])
    setIsDirty(true)
  }

  const removeTag = (removedTagName) => {
    setTagNames([...tagNames.filter(tagName => tagName !== removedTagName)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      updateDatasetTags({
        variables: {
          slug: dataset.slug,
          tagNames
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
    setTagNames(data?.updateDatasetTags?.dataset?.tags ?? dataset.tags)
    setIsDirty(false)
  }

  const displayModeBody = tagNames.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {tagNames
          .filter(tagName => tagName.trim().length > 0)
          .map((tagName, tagIdx) => <TagCard key={tagIdx} tag={tagName} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('dataset.no-tag')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('tag.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='tag-search'>
        {`${format('app.searchAndAssign')} ${format('tag.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, TAG_SEARCH_QUERY, fetchedTagsCallback, locale)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('tag.header') })}
          onChange={addTag}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {tagNames.map((tagName, tagIdx) => (
          <Pill
            key={`tag-${tagIdx}`}
            label={tagName}
            onRemove={() => removeTag(tagName)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('tag.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default DatasetDetailTags

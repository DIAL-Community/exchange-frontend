import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_BUILDING_BLOCK_TAGS } from '../../shared/mutation/buildingBlock'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { TAG_SEARCH_QUERY } from '../../shared/query/tag'

const BuildingBlockDetailTags = ({ buildingBlock, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [tags, setTags] = useState(buildingBlock.tags)
  const [isDirty, setIsDirty] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateBuildingBlockTags, { loading, reset }] = useMutation(UPDATE_BUILDING_BLOCK_TAGS, {
    onError: () => {
      setIsDirty(false)
      setTags(buildingBlock.tags)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.tag.header') }))
    },
    onCompleted: (data) => {
      const { updateBuildingBlockTags: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setIsDirty(false)
        setTags(response?.buildingBlock?.tags)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.tag.header') }))
      } else {
        setIsDirty(false)
        setTags(buildingBlock.tags)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.tag.header') }))
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

      updateBuildingBlockTags({
        variables: {
          slug: buildingBlock.slug,
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
    setTags(buildingBlock.tags)
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-ochre' ref={headerRef}>
      {format('ui.tag.header')}
    </div>

  const displayModeBody = tags.length
    ? <div className='italic text-sm'>
      {tags.join(', ')}
    </div>
    : <div className='text-sm pb-5 text-button-gray'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.tag.label'),
        base: format('ui.buildingBlock.label')
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

export default BuildingBlockDetailTags

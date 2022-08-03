import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../lib/ToastContext'
import Select from '../shared/Select'
import { fetchSelectOptions } from '../../queries/utils'
import Pill from '../shared/Pill'
import EditableSection from '../shared/EditableSection'
import { UPDATE_PROJECT_TAGS } from '../../mutations/project'
import { TAG_SEARCH_QUERY } from '../../queries/tag'
import TagCard from '../tags/TagCard'

const ProjectDetailTags = ({ project, canEdit }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [tags, setTags] = useState(project.tags)

  const [isDirty, setIsDirty] = useState(false)

  const { showToast } = useContext(ToastContext)

  const [updateProjectTags, { data, loading }] = useMutation(UPDATE_PROJECT_TAGS, {
    onError: () => {
      setTags(project.tags)
      setIsDirty(false)
      showToast(format('toast.tags.update.failure'), 'error', 'top-center')
    },
    onCompleted: (data) => {
      setTags(data.updateProjectTags.project.tags)
      setIsDirty(false)
      showToast(format('toast.tags.update.success'), 'success', 'top-center')
    }
  })

  const [session] = useSession()

  const { locale } = useRouter()

  const fetchedTagsCallback = (data) => (
    data.tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
      slug: tag.slug
    }
    ))
  )

  const addTag = (tag) => {
    setTags([...tags.filter(( label ) => label !== tag.label), tag.label ])
    setIsDirty(true)
  }

  const removeTag = (tag) => {
    setTags([...tags.filter(( label ) => label !== tag)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      updateProjectTags({
        variables: {
          slug: project.slug,
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
    setTags(data?.updateProjectTags?.project?.tags ?? project.tags)
    setIsDirty(false)
  }

  const displayModeBody = tags.length
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {tags.map((tag, tagIdx) => <TagCard key={tagIdx} tag={tag} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('project.no-tag')}
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

export default ProjectDetailTags

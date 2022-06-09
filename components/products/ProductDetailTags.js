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
import { UPDATE_PRODUCT_TAGS } from '../../mutations/product'
import { TAGS_SEARCH_QUERY } from '../../queries/tags'
import TagCard from '../tags/TagCard'

const ProductDetailTags = ({ product, canEdit }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [tags, setTags] = useState(product.tags)

  const [isDirty, setIsDirty] = useState(false)

  const { showToast } = useContext(ToastContext)

  const [updateProductTags, { data, loading }] = useMutation(UPDATE_PRODUCT_TAGS, {
    onError: () => {
      setTags(product.tags)
      setIsDirty(false)
      showToast(format('toast.tags.failed.failure'), 'error', 'top-center')
    },
    onCompleted: (data) => {
      setTags(data.updateProductTags.product.tags)
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

      updateProductTags({
        variables: {
          slug: product.slug,
          tags: tags
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
    setTags(data?.updateProductTags?.product?.tags ?? product.tags)
    setIsDirty(false)
  }

  const displayModeBody = tags.length
    ? (
      <div className='card-title mb-3 text-dial-gray-dark'>
        {tags.map((tag, tagIdx) => <TagCard key={tagIdx} tag={tag} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('product.no-tag')}
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
          loadOptions={(input) => fetchSelectOptions(client, input, TAGS_SEARCH_QUERY, fetchedTagsCallback)}
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

export default ProductDetailTags

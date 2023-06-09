import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { FiExternalLink, FiDownload } from 'react-icons/fi'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_ORGANIZATION_RESOURCES } from '../../../mutations/organization'
import { fetchSelectOptions } from '../../../queries/utils'
import { RESOURCE_SEARCH_QUERY } from '../../../queries/resource'
import { prependUrlWithProtocol } from '../../../lib/utilities'

const StorefrontDetailResources = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [isDirty, setIsDirty] = useState(false)
  const [resources, setResources] = useState(organization.resources ?? [])

  const [updateResources, { reset, loading }] = useMutation(UPDATE_ORGANIZATION_RESOURCES, {
    onCompleted: (data) => {
      const { updateOrganizationResources: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        showToast(format('organization.submit.success'), 'success', 'top-center')
        setResources(response?.organization.resources)
        setIsDirty(false)
      } else {
        showToast(format('organization.submit.failure'), 'error', 'top-center')
        setResources(organization.resources ?? [])
        setIsDirty(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('organization.submit.failure'), 'error', 'top-center')
      setResources(organization.resources ?? [])
      setIsDirty(false)
      reset()
    }
  })

  const router = useRouter()
  const { user } = useUser()
  const { locale } = router

  const { showToast } = useContext(ToastContext)

  const addSpecialty = (resource) => {
    setResources([...resources.filter(existing => existing.slug !== resource.slug), resource])
    setIsDirty(true)
  }

  const removeSpecialty = (resource) => {
    setResources([...resources.filter(existing => existing.slug !== resource.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateResources({
        variables: {
          slug: organization.slug,
          resourceSlugs: resources.map(resource => resource.slug)
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

  const fetchedResourcesCallback = (data) => (
    data.resources?.map((resource) => ({
      label: resource.name,
      value: resource.id,
      slug: resource.slug
    }))
  )

  const onCancel = () => {
    setResources(organization.resources)
    setIsDirty(false)
  }

  const createResource = () => {
    router.push(`/storefronts/${organization.slug}/resources/create`)
  }

  const displayModeBody = resources?.length > 0
    ? (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {resources.map((resource, index) =>
          <div key={index} className='border shadow-md rounded-md flex gap-3 px-4'>
            <div className='py-3'>{resource.name}</div>
            <div className='ml-auto flex gap-3 my-auto'>
              <a href={`/resources/${resource.slug}`} target='_blank' rel='noreferrer'>
                <FiExternalLink className='text-sm' />
              </a>
              <a href={prependUrlWithProtocol(resource.link)} target='_blank' rel='noreferrer'>
                <FiDownload className='text-sm' />
              </a>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('storefront.no-resource')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('resource.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='resource-search'>
        {`${format('app.searchAndAssign')} ${format('resource.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, RESOURCE_SEARCH_QUERY, fetchedResourcesCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('resource.header') })}
          onChange={addSpecialty}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {resources?.map((resource, index) => (
          <Pill
            key={`resource-${index}`}
            label={resource.name}
            onRemove={() => removeSpecialty(resource)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('resource.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
      createAction={createResource}
    />
  )
}

export default StorefrontDetailResources

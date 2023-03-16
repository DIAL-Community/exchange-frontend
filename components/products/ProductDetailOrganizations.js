import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../lib/ToastContext'
import Select from '../shared/Select'
import { fetchSelectOptions } from '../../queries/utils'
import Pill from '../shared/Pill'
import OrganizationCard from '../organizations/OrganizationCard'
import EditableSection from '../shared/EditableSection'
import { UPDATE_PRODUCT_ORGANIZATION } from '../../mutations/product'
import { ORGANIZATION_SEARCH_QUERY } from '../../queries/organization'
import { useUser } from '../../lib/hooks'

const ProductDetailOrganizations = ({ product, canEdit }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [organizations, setOrganizations] = useState(product.organizations)

  const [isDirty, setIsDirty] = useState(false)

  const { showToast } = useContext(ToastContext)

  const [updateProductOrganizations, { data, loading, reset }] = useMutation(UPDATE_PRODUCT_ORGANIZATION, {
    onError: () => {
      setIsDirty(false)
      setOrganizations(product.organizations)
      showToast(format('toast.organizations.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateProductOrganizations: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setOrganizations(data.updateProductOrganizations.product.organizations)
        showToast(format('toast.organizations.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setOrganizations(product.organizations)
        showToast(format('toast.organizations.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()

  const { locale } = useRouter()

  const fetchedOrganizationsCallback = (data) => (
    data.organizations?.map((organization) => ({
      label: organization.name,
      value: organization.id,
      slug: organization.slug
    }
    ))
  )

  const addOrganization = (organization) => {
    setOrganizations([
      ...organizations.filter(({ slug }) => slug !== organization.slug),
      { name: organization.label, slug: organization.slug }
    ])
    setIsDirty(true)
  }

  const removeOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ slug }) => slug !== organization.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductOrganizations({
        variables: {
          slug: product.slug,
          organizationsSlugs: organizations.map(({ slug }) => slug)
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
    setOrganizations(data?.updateProductOrganizations?.product?.organizations ?? product.organizations)
    setIsDirty(false)
  }

  const displayModeBody = organizations.length
    ? (
      <div className='card-title mb-3 text-dial-gray-dark'>
        {organizations.map(
          (organization, organizationIdx) =>
            <OrganizationCard key={organizationIdx} organization={organization} listType='list' />
        )}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('product.no-organization')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('organization.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='organization-search'>
        {`${format('app.searchAndAssign')} ${format('organization.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, ORGANIZATION_SEARCH_QUERY, fetchedOrganizationsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('organization.header') })}
          onChange={addOrganization}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {organizations.map((organization, organizationIdx) => (
          <Pill
            key={`organization-${organizationIdx}`}
            label={organization.name}
            onRemove={() => removeOrganization(organization)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('organization.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProductDetailOrganizations

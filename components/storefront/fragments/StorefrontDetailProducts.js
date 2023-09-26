import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { DisplayType } from '../../utils/constants'
import { UPDATE_ORGANIZATION_PRODUCT_CERTIFICATIONS } from '../../shared/mutation/organization'
import { PRODUCT_SEARCH_QUERY } from '../../shared/query/product'
import ProductCard from '../../product/ProductCard'

const StorefrontDetailProductCertifications = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [certifications, setCertifications] = useState(organization.productCertifications)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationCertifications, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_PRODUCT_CERTIFICATIONS, {
    onError() {
      setIsDirty(false)
      setCertifications(organization.productCertifications)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.productCertification.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationCertifications: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setCertifications(response?.organization.productCertifications)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.productCertification.header') }))
      } else {
        setIsDirty(false)
        setCertifications(organization.productCertifications)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.productCertification.header') }))
        reset()
      }
    }
  })

  const fetchedProductCertificationsCallback = (data) => (
    data.products?.map((certification) => ({
      id: certification.id,
      name: certification.name,
      slug: certification.slug,
      label: certification.name
    }))
  )

  const addCertification = (certification) => {
    setCertifications([
      ...[
        ...certifications.filter(({ id }) => id !== certification.id),
        { id: certification.id, name: certification.name, slug: certification.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeCertification = (certification) => {
    setCertifications([...certifications.filter(({ id }) => id !== certification.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOrganizationCertifications({
        variables: {
          productSlugs: certifications.map(({ slug }) => slug),
          slug: organization.slug
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
    setCertifications(organization.productCertifications)
    setIsDirty(false)
  }

  const displayModeBody = certifications.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {certifications?.map((certification, index) =>
        <div key={`product-certification-${index}`}>
          <ProductCard product={certification} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.productCertification.label'),
        base: format('ui.storefront.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.productCertification.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.productCertification.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductCertificationsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.productCertification.label') })}
          onChange={addCertification}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {certifications.map((certification, certificationIdx) => (
          <Pill
            key={`product-certification-${certificationIdx}`}
            label={certification.name}
            onRemove={() => removeCertification(certification)}
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

export default StorefrontDetailProductCertifications

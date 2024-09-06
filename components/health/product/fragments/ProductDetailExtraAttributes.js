import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import EditableSection from '../../../shared/EditableSection'
import { UPDATE_PRODUCT_EXTRA_ATTRIBUTES } from '../../../shared/mutation/product'
import Input from '../../../shared/form/Input'

const ProductDetailExtraAttributes = ({ product, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [extraAttributes, setExtraAttributes] = useState(product.extraAttributes)
  const [isDirty, setIsDirty] = useState(false)

  const [ownership, setOwnership] = useState('')
  const [ownershipType, setOwnershipType] = useState('')
  const [funders, setFunders] = useState('')
  const [fundersType, setFundersType] = useState('')
  const [impact, setImpact] = useState('')
  const [impactType, setImpactType] = useState('')
  const [years, setYears] = useState('')
  const [yearsType, setYearsType] = useState('')

  useEffect(() => {
    product.extraAttributes.forEach(attr => {
      switch (attr.name) {
      case 'Local Ownership':
        setOwnership(attr.value)
        setOwnershipType(attr.type)
        break
      case 'Funders':
        setFunders(attr.value)
        setFundersType(attr.type)
        break
      case 'Impact':
        setImpact(attr.value)
        setImpactType(attr.type)
        break
      case 'Years in production':
        setYears(attr.value)
        setYearsType(attr.type)
        break
      }
    })
  }, [product.extraAttributes])

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductExtraAttributes, { loading, reset }] = useMutation(UPDATE_PRODUCT_EXTRA_ATTRIBUTES, {
    onError() {
      setIsDirty(false)
      setExtraAttributes(product?.extraAttributes)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.extraAttributes.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductExtraAttributes: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setExtraAttributes(response?.product?.extraAttributes)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.extraAttributes.header') }))
      } else {
        setIsDirty(false)
        setExtraAttributes(product?.extraAttributes)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.extraAttributes.header') }))
        reset()
      }
    }
  })

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductExtraAttributes({
        variables: {
          slug: product?.slug,
          extraAttributes: [
            {
              name: 'Local Ownership',
              value: ownership,
              type: ownershipType
            },
            {
              name: 'Funders',
              value: funders,
              type: fundersType
            },
            {
              name: 'Impact',
              value: impact,
              type: impactType
            },
            {
              name: 'Years in production',
              value: years,
              type: yearsType
            }
          ]
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
    setExtraAttributes(product.extraAttributes)
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
      {format('ui.extraAttributes.label')}
    </div>

  const displayModeBody = extraAttributes.length
    ? <div className='flex flex-col gap-y-2'>
      {extraAttributes?.map((attribute, index) =>
        <div key={`extraAttribute-${index}`}>
          <div key={index} className='text-black'>
            {`${attribute.name}: ${attribute.value}`}
          </div>
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('general.na')}
    </div>

  const editModeBody =
    <>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
        <div className='grid grid-cols-4 gap-y-2 gap-x-4'>
          <label className='required-field col-span-3' htmlFor='name'>
            {format('extraAttributes.ownership')}
          </label>
          <label className='required-field col-span-1' htmlFor='name'>
            {format('extraAttributes.type')}
          </label>
          <Input
            className='col-span-4 md:col-span-3'
            id="ownership"
            value={ownership}
            onChange={(e) => {
              setOwnership(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.ownership')}
          />
          <Input
            className='col-span-4 md:col-span-1'
            id="ownershipType"
            value={ownershipType}
            onChange={(e) => {
              setOwnershipType(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.type')}
          />
        </div>
        <div className="grid grid-cols-4 gap-y-2 gap-x-4">
          <label className="required-field col-span-3" htmlFor="name">
            {format('extraAttributes.funders')}
          </label>
          <label className="required-field col-span-1" htmlFor="name">
            {format('extraAttributes.type')}
          </label>
          <Input
            className='col-span-4 md:col-span-3'
            id="funders"
            value={funders}
            onChange={(e) => {
              setFunders(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.funders')}
          />
          <Input
            className='col-span-4 md:col-span-1'
            id="fundersType"
            value={fundersType}
            onChange={(e) => {
              setFundersType(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.type')}
          />
        </div>
        <div className="grid grid-cols-4 gap-y-2 gap-x-4">
          <label className="required-field col-span-3" htmlFor="name">
            {format('extraAttributes.impact')}
          </label>
          <label className="required-field col-span-1" htmlFor="name">
            {format('extraAttributes.type')}
          </label>
          <Input
            className='col-span-4 md:col-span-3'
            id="impact"
            value={impact}
            onChange={(e) => {
              setImpact(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.impact')}
          />
          <Input
            className='col-span-4 md:col-span-1'
            id="impactType"
            value={impactType}
            onChange={(e) => {
              setImpactType(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.type')}
          />
        </div>
        <div className="grid grid-cols-4 gap-y-2 gap-x-4">
          <label className="required-field col-span-3" htmlFor="name">
            {format('extraAttributes.years')}
          </label>
          <label className="required-field col-span-1" htmlFor="name">
            {format('extraAttributes.type')}
          </label>
          <Input
            className='col-span-4 md:col-span-3'
            id="years"
            value={years}
            onChange={(e) => {
              setYears(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.years')}
          />
          <Input
            className='col-span-4 md:col-span-1'
            id="yearsType"
            value={yearsType}
            onChange={(e) => {
              setYearsType(e.target.value)
              setIsDirty(true)
            }}
            placeholder={format('extraAttributes.type')}
          />
        </div>
      </div>
    </>

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

export default ProductDetailExtraAttributes

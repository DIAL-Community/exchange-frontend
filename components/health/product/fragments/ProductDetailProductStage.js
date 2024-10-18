import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Controller, useForm } from 'react-hook-form'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import EditableSection from '../../../shared/EditableSection'
import { UPDATE_PRODUCT_EXTRA_ATTRIBUTES } from '../../../shared/mutation/product'
import Input from '../../../shared/form/Input'
import { ProductMaturityAttributeNames, ProductStageType } from '../../../utils/constants'
import Select from '../../../shared/form/Select'

const ProductDetailExtraAttributes = ({ product, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [isDirty, setIsDirty] = useState(false)
  const [initialValues, setInitialValues] = useState([])

  const { control, handleSubmit, reset: VariablesReset } = useForm({
    defaultValues: {
      extraAttributes: ProductMaturityAttributeNames.map(name => ({ name, value: '', type: '' }))
    }
  })

  const productStageOptions = Object.keys(ProductStageType).map((key) => ({
    value: ProductStageType[key],
    label: ProductStageType[key].charAt(0).toUpperCase() + ProductStageType[key].slice(1)
  }))

  useEffect(() => {
    if (product?.extraAttributes.length) {
      const formattedExtraAttributes = ProductMaturityAttributeNames.map(name => {
        const existingAttr = product.extraAttributes.find(attr => attr.name === name)

        return existingAttr || { name, value: '', type: '' }
      })
      setInitialValues(formattedExtraAttributes)
      VariablesReset({ extraAttributes: formattedExtraAttributes })
    }
  }, [VariablesReset, product.extraAttributes])

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductExtraAttributes, { loading, reset }] = useMutation(UPDATE_PRODUCT_EXTRA_ATTRIBUTES, {
    onError() {
      setIsDirty(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.extraAttributes.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductExtraAttributes: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.extraAttributes.header') }))
      } else {
        setIsDirty(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.extraAttributes.header') }))
        reset()
      }
    }
  })

  const onSubmit = (data) => {
    if (user) {
      const { extraAttributes } = data
      updateProductExtraAttributes({
        variables: {
          slug: product?.slug,
          extraAttributes
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const onCancel = () => {
    VariablesReset({ extraAttributes: initialValues })
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
      {product.productStage
        ? `${format('ui.productStage.header')} -  ${product.productStage.toUpperCase()}`
        : format('ui.productStage.header')
      }
    </div>

  const displayModeBody = product?.extraAttributes.length
    ? <div className='flex flex-col gap-y-2'>
      {initialValues?.map((attribute, index) =>
        <div key={`extraAttribute-${index}`} className='text-health-green'>{`${attribute.name}: `}
          <span key={index} className='text-black'>
            {`${attribute.value.length ? attribute.value : format('general.na')}`}
          </span>
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('product.noProductStage')}
    </div>

  const editModeBody =
    <>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
        <form>
          {ProductMaturityAttributeNames.map((name, index) => (
            <div key={name} className="grid grid-cols-4 gap-2 mt-2">
              <label className="col-span-3">{name}</label>
              <label className="col-span-1">{format('extraAttributes.type')}</label>
              <Controller
                name={`extraAttributes.${index}.value`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="col-span-3"
                    placeholder={name}
                    onChange={(e) => {
                      field.onChange(e)
                      setIsDirty(true)
                    }}
                  />
                )}
              />
              <Controller
                name={`extraAttributes.${index}.type`}
                control={control}
                render={({ field }) => (
                  <Select
                    className="col-span-1"
                    options={productStageOptions}
                    placeholder={format('extraAttributes.type')}
                    onChange={(value) => {
                      field.onChange(value.value)
                      setIsDirty(true)
                    }}
                    value={productStageOptions.find(option => option.value === field.value) || null}
                  />
                )}
              />
              <Controller
                name={`extraAttributes.${index}.name`}
                control={control}
                render={({ field }) => (
                  <input type="hidden" {...field} value={name} />
                )}
              />
            </div>
          ))}
        </form>
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProductDetailExtraAttributes

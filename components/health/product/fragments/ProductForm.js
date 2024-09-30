import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useProductOwnerUser, useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import Checkbox from '../../../shared/form/Checkbox'
import FileUploader from '../../../shared/form/FileUploader'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import IconButton from '../../../shared/form/IconButton'
import Input from '../../../shared/form/Input'
import UrlInput from '../../../shared/form/UrlInput'
import ValidationError from '../../../shared/form/ValidationError'
import { CREATE_PRODUCT } from '../../../shared/mutation/product'
import { PAGINATED_PRODUCTS_QUERY, PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../../shared/query/product'
import { DEFAULT_PAGE_SIZE, ProductExtraAttributeNames, ProductStageType } from '../../../utils/constants'
import Select from '../../../shared/form/Select'

const ProductForm = React.memo(({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = product?.slug ?? ''

  const { isProductOwner } = useProductOwnerUser(product)
  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [productStage, setProductStage] = useState(null)

  const updateProductStageValue = (productStage) => setProductStage(productStage)

  const productStageOptions = Object.keys(ProductStageType).map((key) => ({
    value: ProductStageType[key],
    label: ProductStageType[key].charAt(0).toUpperCase() + ProductStageType[key].slice(1)
  }))

  const handleTrimInputOnBlur = (event) => {
    event.target.value = event.target.value.trim()
  }

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateProduct, { reset }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{
      query: PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_PRODUCTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createProduct.product && data.createProduct.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/health/products/${data.createProduct.product.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.product.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.product.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.product.label') }))
      setMutating(false)
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
    reset: resetVariables,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: product?.name,
      aliases: product?.aliases?.length ? product?.aliases.map((value) => ({ value })) : [{ value: '' }],
      website: product?.website,
      description: product?.productDescription?.description,
      commercialProduct: product?.commercialProduct,
      hostingModel: product?.hostingModel,
      pricingModel: product?.pricingModel,
      pricingDetails: product?.pricingDetails,
      pricingUrl: product?.pricingUrl,
      productStage: product?.productStage ?? null,
      extraAttributes: ProductExtraAttributeNames.map(name => ({ name, value: '', type: '' })),
      featured: product?.featured,
      contact: product?.contact
    }
  })

  useEffect(() => {
    // Load existing values when the component mounts
    if (product?.extraAttributes.length) {
      const formattedExtraAttributes = ProductExtraAttributeNames.map(name => {
        const existingAttr = product.extraAttributes.find(attr => attr.name === name)

        return existingAttr || { name, value: '', type: '' }
      })
      resetVariables({ extraAttributes: formattedExtraAttributes })
    }
  }, [resetVariables, product?.extraAttributes])

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])
  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        imageFile,
        website,
        description,
        aliases,
        commercialProduct,
        pricingUrl,
        hostingModel,
        pricingModel,
        pricingDetails,
        productStage,
        extraAttributes,
        featured,
        contact
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        description,
        commercialProduct,
        pricingUrl,
        hostingModel,
        pricingModel,
        pricingDetails,
        productStage,
        extraAttributes,
        featured,
        contact
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateProduct({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/health/products/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser || isProductOwner ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {product
                ? format('app.editEntity', { entity: product.name })
                : `${format('app.createNew')} ${format('ui.product.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('product.name')}
              </label>
              <Input
                {...register(
                  'name',
                  {
                    required: format('validation.required'),
                    maxLength: { value: 80, message: format('validation.max-length.text', { maxLength: 80 }) }
                  })}
                id='name'
                placeholder={format('product.name')}
                isInvalid={errors.name}
                onBlur={handleTrimInputOnBlur}
              />
              {errors.name && <ValidationError value={errors.name?.message}/>}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>{format('product.aliases')}</label>
              {aliases.map((alias, aliasIdx) => (
                <div key={alias.id} className='flex gap-x-2'>
                  <Input
                    {...register(`aliases.${aliasIdx}.value`)}
                    placeholder={format('product.alias')}
                  />
                  {isLastAlias(aliasIdx) &&
                    <IconButton
                      className='bg-dial-meadow'
                      icon={<FaPlus className='text-sm'/>}
                      onClick={() => append({ value: '' })}
                    />
                  }
                  {!isSingleAlias &&
                    <IconButton
                      className='bg-dial-meadow'
                      icon={<FaMinus className='text-sm'/>}
                      onClick={() => remove(aliasIdx)}
                    />
                  }
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='website'>
                {format('product.website')}
              </label>
              <Controller
                id='website'
                name='website'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    id='website'
                    value={value}
                    onChange={onChange}
                    placeholder={format('product.website')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='contact'>
                {format('product.contact')}
              </label>
              <Input
                {...register(
                  'contact',
                  {
                    required: format('validation.required'),
                    maxLength: { value: 80, message: format('validation.max-length.text', { maxLength: 80 }) },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'invalid email address'
                    }
                  })}
                id='name'
                placeholder={format('product.contact')}
                isInvalid={errors.name}
                onBlur={handleTrimInputOnBlur}
              />
              {errors.contact && <ValidationError value={errors.contact?.message}/>}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>{format('product.imageFile')}</label>
              <FileUploader {...register('imageFile')} />
            </div>
            <label className='flex gap-x-2 mb-2 items-center self-start'>
              <Checkbox {...register('featured')} />
              {format('product.isProductFeatured')}
            </label>
            <div className="flex flex-col gap-y-2">
              <label>{format('app.productStage')}</label>
              <Controller
                name="productStage"
                control={control}
                render={({ field }) => (
                  <Select
                    options={productStageOptions}
                    placeholder={format('app.productStage')}
                    onChange={(value) => {
                      field.onChange(value.value)
                      updateProductStageValue(value)
                    }}
                    value={productStage}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              {ProductExtraAttributeNames.map((name, index) => (
                <div key={name} className="grid grid-cols-4 gap-2">
                  <label className="col-span-3">{name}</label>
                  <label className="col-span-1">Type</label>
                  <Controller
                    name={`extraAttributes.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} className="col-span-3" placeholder={name}/>
                    )}
                  />
                  <Controller
                    name={`extraAttributes.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} className="col-span-1" placeholder="Type"/>
                    )}
                  />
                  <Controller
                    name={`extraAttributes.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <input type="hidden" {...field} value={name}/>
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="required-field">{format('product.description')}</label>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('product.description')}
                    isInvalid={errors.description}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.description && <ValidationError value={errors.description?.message}/>}
            </div>
            <hr className='border-b border-dashed border-dial-slate-300'/>
            <div className='text-2xl font-semibold pb-4'>
              {format('product.pricingInformation')}
            </div>
            <label className='flex gap-x-2 mb-2 items-center self-start'>
              <Checkbox {...register('commercialProduct')} />
              {format('product.commercialProduct')}
            </label>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='pricingUrl'>
                {format('product.pricingUrl')}
              </label>
              <Controller
                name='pricingUrl'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    value={value}
                    onChange={onChange}
                    id='pricingUrl'
                    placeholder={format('product.pricingUrl')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='hostingModel'>
                {format('product.hostingModel')}
              </label>
              <Input
                id='hostingModel'
                {...register('hostingModel')}
                placeholder={format('product.hostingModel')}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='pricingModel'>
                {format('product.pricingModel')}
              </label>
              <Input
                id='pricingModel'
                {...register('pricingModel')}
                placeholder={format('product.pricingModel')}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>{format('product.pricing.details')}</label>
              <Controller
                name='pricingDetails'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='pricing-details-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('product.pricing.details')}
                    isInvalid={errors.pricingDetails}
                  />
                )}
              />
            </div>
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button
                type='submit'
                className='submit-button'
                disabled={mutating || reverting}
              >
                {`${format('app.submit')} ${format('ui.product.label')}`}
                {mutating && <FaSpinner className='spinner ml-3'/>}
              </button>
              <button
                type='button'
                className='cancel-button'
                disabled={mutating || reverting}
                onClick={cancelForm}
              >
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3'/>}
              </button>
            </div>
          </div>
        </div>
      </form>
      : <Unauthorized/>
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

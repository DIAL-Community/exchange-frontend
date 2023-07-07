import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_PRODUCT } from '../../shared/mutation/product'
import { REBRAND_BASE_PATH } from '../../utils/constants'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Checkbox from '../../shared/form/Checkbox'

const ProductForm = React.memo(({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = product?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateProduct, { reset }] = useMutation(CREATE_PRODUCT, {
    onCompleted: (data) => {
      if (data.createProduct.product && data.createProduct.errors.length === 0) {
        setMutating(false)
        showToast(format('product.submit.success'), 'success', 'top-center', 1000, null, () =>
          router.push(`/${router.locale}/products/${data.createProduct.product.slug}`)
        )
      } else {
        setMutating(false)
        showToast(
          <div className='flex flex-col'>
            <span>{format('product.submit.failure')}</span>
          </div>,
          'error',
          'top-center',
          1000
        )
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('product.submit.failure')}</span>
        </div>,
        'error',
        'top-center',
        1000
      )
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
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
      pricingUrl: product?.pricingUrl
    }
  })

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
        pricingDetails
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
        pricingDetails
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
    router.push(`${REBRAND_BASE_PATH}/products/${slug}`)
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='py-4'>
        <div className='flex flex-col gap-y-4 text-dial-meadow'>
          <div className='text-xl font-semibold'>
            {product
              ? format('app.edit-entity', { entity: product.name })
              : `${format('app.create-new')} ${format('product.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('product.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('product.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label>{format('product.aliases')}</label>
            {aliases.map((alias, aliasIdx) => (
              <div key={alias.id} className='flex gap-x-2'>
                <Input {...register(`aliases.${aliasIdx}.value`)} placeholder={format('product.alias')} />
                {isLastAlias(aliasIdx) &&
                  <IconButton
                    className='bg-dial-meadow'
                    icon={<FaPlus className='text-sm' />}
                    onClick={() => append({ value: '' })}
                  />
                }
                {!isSingleAlias &&
                  <IconButton
                    className='bg-dial-meadow'
                    icon={<FaMinus className='text-sm' />}
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
                <UrlInput value={value} onChange={onChange} id='website' placeholder={format('product.website')} />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label>{format('product.imageFile')}</label>
            <FileUploader {...register('imageFile')} />
          </div>
          <div className='block flex flex-col gap-y-2'>
            <label className='required-field'>{format('product.description')}</label>
            <Controller
              name='description'
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
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <hr className='my-3' />
          <iv className='text-2xl font-semibold pb-4'>{format('product.pricingInformation')}</iv>
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
            <Input {...register('hostingModel')} id='hostingModel' placeholder={format('product.hostingModel')} />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='pricingModel'>
              {format('product.pricingModel')}
            </label>
            <Input {...register('pricingModel')} id='pricingModel' placeholder={format('product.pricingModel')} />
          </div>
          <div className='block flex flex-col gap-y-2'>
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
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('product.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3' />}
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <Unauthorized />
  )
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

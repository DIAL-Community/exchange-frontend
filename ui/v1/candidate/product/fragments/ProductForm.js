import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../../lib/ToastContext'
import { useUser } from '../../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../../components/shared/FetchStatus'
import Input from '../../../shared/form/Input'
import ValidationError from '../../../shared/form/ValidationError'
import FileUploader from '../../../shared/form/FileUploader'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { CREATE_PRODUCT } from '../../../shared/mutation/product'
import { REBRAND_BASE_PATH } from '../../../utils/constants'
import UrlInput from '../../../shared/form/UrlInput'

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
        const redirectPath = `/${router.locale}/products/${data.createProduct.product.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showToast(format('product.submit.success'), 'success', 'top-center', 1000, null, redirectHandler)
      } else {
        setMutating(false)
        showToast(format('product.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('product.submit.failure'), 'error', 'top-center')
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
      website: product?.website,
      description: product?.description
    }
  })

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
        description
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        website,
        description
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
    router.push(`${REBRAND_BASE_PATH}/candidate/products/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {product
                ? format('app.editEntity', { entity: product.name })
                : `${format('app.createNew')} ${format('product.label')}`}
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
      : <Unauthorized />
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

import { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../../../lib/ToastContext'
import Checkbox from '../../../../shared/form/Checkbox'
import { HtmlEditor } from '../../../../shared/form/HtmlEditor'
import Input from '../../../../shared/form/Input'
import UrlInput from '../../../../shared/form/UrlInput'
import ValidationError from '../../../../shared/form/ValidationError'
import { CREATE_PRODUCT_REPOSITORY } from '../../../../shared/mutation/productRepository'

const ProductRepositoryForm = forwardRef(({ product, productRepository }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const productSlug = product?.slug
  const repositorySlug = productRepository?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const formRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.top', ref: formRef }
  ]), [])

  const [updateProduct, { reset }] = useMutation(CREATE_PRODUCT_REPOSITORY, {
    onCompleted: (data) => {
      const { createProductRepository: response } = data
      if (response.productRepository && response.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/health/products/${productSlug}` +
          `/repositories/${response.productRepository.slug}`
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
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: productRepository?.name,
      absoluteUrl: productRepository?.absoluteUrl,
      description: productRepository?.description,
      mainRepository: productRepository?.mainRepository
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const {
      name,
      absoluteUrl,
      description,
      mainRepository
    } = data

    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      productSlug,
      name,
      slug: repositorySlug,
      absoluteUrl,
      description,
      mainRepository: `${mainRepository}` === 'true'
    }

    updateProduct({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/health/products/${productSlug}/${repositorySlug ? 'repositories' : ''}/${repositorySlug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow' ref={formRef}>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {productRepository
              ? format('app.editEntity', { entity: productRepository.name })
              : `${format('app.createNew')} ${format('productRepository.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('productRepository.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('productRepository.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <label className='flex gap-x-2 items-center self-start text-dial-sapphire'>
            <Checkbox {...register('mainRepository')} />
            {format('productRepository.mainRepository.label')}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='absoluteUrl' className='required-field'>
              {format('productRepository.absoluteUrl')}
            </label>
            <Controller
              id='absoluteUrl'
              name='absoluteUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='absoluteUrl'
                  value={value}
                  onChange={onChange}
                  placeholder={format('productRepository.absoluteUrl')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.absoluteUrl && <ValidationError value={errors.absoluteUrl?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('productRepository.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('productRepository.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button
              type='submit'
              className='submit-button'
              disabled={mutating || reverting}
            >
              {`${format('app.submit')} ${format('productRepository.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            <button
              type='button'
              className='cancel-button'
              disabled={mutating || reverting}
              onClick={cancelForm}
            >
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3' />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
})

ProductRepositoryForm.displayName = 'ProductRepositoryForm'

export default ProductRepositoryForm

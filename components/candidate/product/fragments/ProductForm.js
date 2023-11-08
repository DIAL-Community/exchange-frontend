import React, { useState, useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import Input from '../../../shared/form/Input'
import ValidationError from '../../../shared/form/ValidationError'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { CREATE_CANDIDATE_PRODUCT } from '../../../shared/mutation/candidateProduct'
import UrlInput from '../../../shared/form/UrlInput'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import {
  CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_CANDIDATE_PRODUCTS_QUERY
} from '../../../shared/query/candidateProduct'

const ProductForm = React.memo(({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = product?.slug ?? ''

  const captchaRef = useRef()
  const [captchaValue, setCaptchaValue] = useState()

  const { user, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateProduct, { reset }] = useMutation(CREATE_CANDIDATE_PRODUCT, {
    refetchQueries: [{
      query: CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_CANDIDATE_PRODUCTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { createCandidateProduct: response } = data
      if (response.candidateProduct && response.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}` +
                             `/candidate/products/${response.candidateProduct.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.candidateProduct.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateProduct.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateProduct.label') }))
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
      name: product?.name ?? '',
      website: product?.website ?? '',
      repository: product?.repository ?? '',
      description: product?.description ?? '',
      submitterEmail: product?.submitterEmail ?? ''
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
        website,
        repository,
        description,
        submitterEmail
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        website,
        repository,
        description,
        submitterEmail,
        captcha: captchaValue
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

  const updateCaptchaData = (value) => {
    setCaptchaValue(value)
  }

  const cancelForm = () => {
    if (product) {
      setReverting(true)
      router.push(`/${locale}/candidate/products/${slug}`)
    }
  }

  return loadingUserSession
    ? <Loading />
    : user
      ? <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {product
                ? format('app.editEntity', { entity: product.name })
                : `${format('app.createNew')} ${format('ui.product.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('ui.candidateProduct.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('ui.candidateProduct.name.placeholder')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='website'>
                {format('ui.candidateProduct.website')}
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
                    placeholder={format('ui.candidateProduct.website.placeholder')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='repository'>
                {format('ui.candidateProduct.repository')}
              </label>
              <Controller
                id='repository'
                name='repository'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    id='repository'
                    value={value}
                    onChange={onChange}
                    placeholder={format('ui.candidateProduct.repository.placeholder')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field'>
                {format('ui.candidateProduct.description')}
              </label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('ui.candidateProduct.description.placeholder')}
                    isInvalid={errors.description}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.description && <ValidationError value={errors.description?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='submitterEmail'>
                {format('ui.candidateProduct.email')}
              </label>
              <Input
                {...register('submitterEmail', { required: format('validation.required') })}
                id='submitterEmail'
                placeholder={format('ui.candidateProduct.email.placeholder')}
                isInvalid={errors.submitterEmail}
              />
              {errors.submitterEmail && <ValidationError value={errors.submitterEmail?.message} />}
            </div>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
              onChange={updateCaptchaData}
              ref={captchaRef}
            />
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button
                type='submit'
                className='submit-button'
                disabled={mutating || reverting || !captchaValue}
              >
                {`${format('app.submit')} ${format('ui.product.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              {product &&
                <button type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3' />}
                </button>
              }
            </div>
          </div>
        </div>
      </form>
      : <Unauthorized />
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

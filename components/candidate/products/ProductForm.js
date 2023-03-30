import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { validate } from 'email-validator'
import { ToastContext } from '../../../lib/ToastContext'
import { CREATE_CANDIDATE_PRODUCT } from '../../../mutations/product'
import Input from '../../shared/Input'
import ValidationError from '../../shared/ValidationError'
import { HtmlEditor } from '../../shared/HtmlEditor'
import { Unauthorized } from '../../shared/FetchStatus'
import UrlInput from '../../shared/UrlInput'
import { BREADCRUMB_SEPARATOR } from '../../shared/breadcrumb'
import { useUser } from '../../../lib/hooks'
import Select from '../../shared/Select'
import { getProductLicenseType } from '../../../lib/utilities'

const ProductForm = ({ candidateProduct }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { user, isAdminUser } = useUser()

  const { showToast } = useContext(ToastContext)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const captchaRef = useRef(null)

  const slug = candidateProduct?.slug ?? ''

  const licenseTypeOptions = getProductLicenseType(format)
  const [ossLicenseType, commercialLicenseType] = licenseTypeOptions

  const [createCandidateProduct, { reset }] = useMutation(CREATE_CANDIDATE_PRODUCT, {
    onError: () => {
      setMutating(false)
      showToast(format('candidate-product.submit.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { createCandidateProduct: response } = data
      if (response?.errors?.length === 0) {
        setMutating(false)
        showToast(
          format('candidate-product.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => {
            const nextPath = !isAdminUser ? '/products' : '/candidate/products/'
            router.push(nextPath)
          }
        )
      } else {
        setMutating(false)
        showToast(format('candidate-product.submit.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { handleSubmit, register, control, setValue, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: candidateProduct?.name,
      description: candidateProduct?.description,
      repository: candidateProduct?.repository || '',
      website: candidateProduct?.website || '',
      submitterEmail: candidateProduct?.submitterEmail,
      commercialProduct: candidateProduct?.commercialProduct ? commercialLicenseType : ossLicenseType,
      captcha: null
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const captcha = captchaRef.current.getValue()

      const { userEmail, userToken } = user
      const { name, description, submitterEmail, website, repository, commercialProduct } = data

      const variables = {
        slug,
        name,
        website,
        repository,
        description,
        submitterEmail,
        commercialProduct: commercialProduct.value === 'commercial',
        captcha
      }

      createCandidateProduct({
        variables,
        context: {
          headers: {
            'Accept-Language': router.locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    const nextPath = !isAdminUser ? '/products' : '/candidate/products/'
    router.push(nextPath)
  }

  // Building breadcrumbs
  const parentBreadcrumb = () =>
    isAdminUser
      ? (
        <Link href='/candidate/products'>
          <a className='text-dial-blue'>
            {format('candidateProduct.label')}
          </a>
        </Link>
      )
      : (
        <Link href='/products'>
          <a className='text-dial-blue'>
            {format('product.header')}
          </a>
        </Link>
      )

  const childBreadcrumb = (candidateProduct) =>
    !candidateProduct || !isAdminUser
      ? (
        <span className='text-dial-gray-dark'>
          {format('app.create')}
        </span>
      )
      : (
        <>
          <Link href={`/candidate/products/${candidateProduct.slug}`}>
            <a className='text-dial-blue'>
              {candidateProduct?.name}
            </a>
          </Link>
          {BREADCRUMB_SEPARATOR}
          <span className='text-dial-gray-dark'>
            {format('app.edit')}
          </span>
        </>
      )

  const generateBreadcrumb = (candidateProduct) => (
    <div className='bg-white pb-3 lg:py-4 whitespace-nowrap text-ellipsis overflow-hidden'>
      <Link href='/'>
        <a className='inline text-dial-blue h5'>
          {format('app.home')}
        </a>
      </Link>
      <div className='inline h5'>
        {BREADCRUMB_SEPARATOR}
        {parentBreadcrumb()}
        {BREADCRUMB_SEPARATOR}
        {childBreadcrumb(candidateProduct)}
      </div>
    </div>
  )

  useEffect(() => {
    register('captcha', { required: format('validation.required') })
  }, [register, format])

  return user ? (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        { generateBreadcrumb(candidateProduct) }
      </div>
      <div className='py-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {format('candidateProduct.label')}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='candidate-product-name'>
                    <label className='form-field-label required-field' htmlFor='name'>
                      {format('candidateProduct.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('candidateProduct.name.placeholder')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-product-website'>
                    <label className='form-field-label required-field' htmlFor='website'>
                      {format('candidateProduct.website')}
                    </label>
                    <Controller
                      name='website'
                      control={control}
                      rules={{ required: format('validation.required') }}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          value={value}
                          onChange={onChange}
                          id='website'
                          placeholder={format('candidateProduct.website.placeholder')}
                        />
                      )}
                    />
                    {errors.website && <ValidationError value={errors.website?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-product-repository'>
                    <label className='form-field-label required-field' htmlFor='repository'>
                      {format('candidateProduct.repository')}
                    </label>
                    <Controller
                      name='repository'
                      control={control}
                      rules={{ required: format('validation.required') }}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          value={value}
                          onChange={onChange}
                          id='repository'
                          placeholder={format('candidateProduct.repository.placeholder')}
                        />
                      )}
                    />
                    {errors.repository && <ValidationError value={errors.repository?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-product-email'>
                    <label className='form-field-label required-field' htmlFor='submitterEmail'>
                      {format('candidateProduct.email')}
                    </label>
                    <Input
                      type='email'
                      {...register('submitterEmail', {
                        required: format('validation.required'),
                        validate: value => validate(value) || format('validation.email')
                      })}
                      id='submitterEmail'
                      placeholder={format('candidateProduct.email.placeholder')}
                      isInvalid={errors.email}
                    />
                    {errors.email && <ValidationError value={errors.email?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='building-block-maturity'>
                    <label className='flex gap-x-2 mb-2 items-center self-start text-dial-sapphire'>
                      {format('product.license')}
                    </label>
                    <Controller
                      name='commercialProduct'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={licenseTypeOptions}
                          placeholder={format('product.commercialProduct')}
                        />
                      )}
                    />
                  </div>
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                    ref={captchaRef}
                    onChange={value => {
                      setValue('captcha', value, { shouldValidate: true })
                    }}
                  />
                  {errors.captcha && <ValidationError value={errors.captcha?.message} />}
                </div>
                <div className='w-full lg:w-2/3' style={{ minHeight: '20rem' }} data-testid='candidate-product-description'>
                  <label className='block text-dial-sapphire flex flex-col gap-y-2'>
                    <p className='required-field'> {format('candidateProduct.description')}</p>
                    <Controller
                      name='description'
                      control={control}
                      rules={{ required: format('validation.required') }}
                      render={({ field: { value, onChange, onBlur } }) => {
                        return (
                          <HtmlEditor
                            editorId={`${name}-editor`}
                            onBlur={onBlur}
                            onChange={onChange}
                            initialContent={value}
                            isInvalid={errors.description}
                            placeholder={format('candidateProduct.description.placeholder')}
                          />
                        )
                      }}
                    />
                    {errors.description && <ValidationError value={errors.description?.message} />}
                  </label>
                </div>
              </div>
              <div className='flex flex-wrap font-semibold text-xl lg:mt-8 gap-3'>
                <button
                  type='submit'
                  data-testid='submit-button'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {format('candidateProduct.submit')}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3 inline' />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : <Unauthorized />
}

export default ProductForm

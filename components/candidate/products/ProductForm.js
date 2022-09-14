import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/client'
import { ToastContext } from '../../../lib/ToastContext'
import { CREATE_CANDIDATE_PRODUCT } from '../../../mutations/product'
import Input from '../../shared/Input'
import ValidationError from '../../shared/ValidationError'
import { HtmlEditor } from '../../shared/HtmlEditor'
import { emailRegex } from '../../shared/emailRegex'
import { Unauthorized } from '../../shared/FetchStatus'

const ProductForm = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const router = useRouter()

  const [session] = useSession()

  const { showToast } = useContext(ToastContext)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [createCandidateProduct] = useMutation(CREATE_CANDIDATE_PRODUCT, {
    onError: () => {
      showToast(
        format('candidate-product.submit.failure'),
        'error',
        'top-center',
        false
      )
    },
    onCompleted: () => {
      showToast(
        format('candidate-product.submit.success'),
        'success',
        'top-center',
        1000,
        null,
        () => router.push('/products')
      )
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: '',
      description: '',
      repository: '',
      website: '',
      email: '',
      captcha: null
    }
  })

  const doUpsert = async (data) => {
    if (session) {
      setMutating(true)

      const { userEmail, userToken } = session.user
      const { name, description, repository, website, email, captcha } = data
      const variables = {
        name,
        website,
        repository,
        description,
        email,
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
    router.push('/products')
  }

  return session ? (
    <div className='flex flex-col'>
      <div className='py-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-bold text-dial-blue pb-4'>
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
                    <label className='form-field-label' htmlFor='website'>
                      {format('candidateProduct.website')}
                    </label>
                    <Input
                      {...register('website')}
                      id='website'
                      placeholder={format('candidateProduct.website.placeholder')}
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-product-repository'>
                    <label className='form-field-label' htmlFor='repository'>
                      {format('candidateProduct.repository')}
                    </label>
                    <Input
                      {...register('repository')}
                      id='repository'
                      placeholder={format('candidateProduct.repository.placeholder')}
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-product-email'>
                    <label className='form-field-label required-field' htmlFor='email'>
                      {format('candidateProduct.email')}
                    </label>
                    <Input
                      type='email'
                      {...register('email', {
                        required: format('validation.required'),
                        pattern: { value: emailRegex , message: format('validation.email') }
                      })}
                      id='email'
                      placeholder={format('candidateProduct.email.placeholder')}
                      isInvalid={errors.email}
                    />
                    {errors.email && <ValidationError value={errors.email?.message} />}
                  </div>
                  <Controller
                    name='captcha'
                    control={control}
                    rules={{ required: format('validation.required') }}
                    render={({ field: { onChange, ref } }) => {
                      return (<ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY} ref={ref} onChange={onChange} />)
                    }}
                  />
                  {errors.captcha && <ValidationError value={errors.captcha?.message} />}
                </div>
                <div className='w-full lg:w-2/3' style={{ minHeight: '20rem' }} data-testid='candidate-product-description'>
                  <label className='block text-xl text-dial-blue flex flex-col gap-y-2'>
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

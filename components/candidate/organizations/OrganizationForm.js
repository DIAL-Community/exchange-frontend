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
import { CREATE_CANDIDATE_ORGANIZATION } from '../../../mutations/organization'
import Input from '../../shared/Input'
import ValidationError from '../../shared/ValidationError'
import { HtmlEditor } from '../../shared/HtmlEditor'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { useUser } from '../../../lib/hooks'
import UrlInput from '../../shared/UrlInput'
import { BREADCRUMB_SEPARATOR } from '../../shared/breadcrumb'

const OrganizationForm = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { user, loadingUserSession } = useUser()

  const { showToast } = useContext(ToastContext)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const captchaRef = useRef(null)

  const [createCandidateOrganization, { reset }] = useMutation(CREATE_CANDIDATE_ORGANIZATION, {
    onError: () => {
      setMutating(false)
      showToast(
        format('ui.candidateOrganization.submit.failure'),
        'error',
        'top-center',
        1000
      )
      reset()
    },
    onCompleted: () => {
      setMutating(false)
      showToast(
        format('ui.candidateOrganization.submit.success'),
        'success',
        'top-center',
        1000,
        null,
        () => router.push('/organizations')
      )
    }
  })

  const { handleSubmit, register, control, setValue, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: '',
      description: '',
      organizationName: '',
      website: '',
      email: '',
      title: '',
      captcha: null
    }
  })

  useEffect(() => {
    if (user) {
      const { userEmail } = user
      setValue('email', userEmail )
    }
  }, [user])

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const captcha = captchaRef.current.getValue()

      const { userEmail, userToken } = user
      const { name, description, organizationName, email, title, website } = data

      const variables = {
        name,
        website,
        organizationName,
        description,
        email,
        title,
        captcha
      }

      createCandidateOrganization({
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
    router.push('/organizations')
  }

  useEffect(() => {
    register('captcha', { required: format('validation.required') })
  }, [register, format])

  return (
    loadingUserSession ? <Loading /> : user ? (
      <div className='flex flex-col'>
        <div className='hidden lg:block px-8'>
          <div className='bg-white pb-3 lg:py-4 whitespace-nowrap text-ellipsis overflow-hidden'>
            <Link href='/' className='inline text-dial-blue h5'>
              {format('app.home')}
            </Link>
            <div className='inline h5'>
              {BREADCRUMB_SEPARATOR}
              <Link href='/organizations' className='text-dial-blue'>
                {format('ui.organization.header')}
              </Link>
              {BREADCRUMB_SEPARATOR}
              <span className='text-dial-gray-dark'>
                {format('app.create')}
              </span>
            </div>
          </div>
        </div>
        <div className='py-8 px-8'>
          <div id='content' className='sm:px-0 max-w-full mx-auto'>
            <form onSubmit={handleSubmit(doUpsert)}>
              <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
                <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                  {format('ui.candidateOrganization.label')}
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                    <div className='form-field-wrapper' data-testid='candidate-organization-organization-name'>
                      <label className='form-field-label required-field' htmlFor='organizationName'>
                        {format('ui.candidateOrganization.organizationName')}
                      </label>
                      <Input
                        {...register('organizationName', { required: format('validation.required') })}
                        id='organizationName'
                        placeholder={format('ui.candidateOrganization.organizationName.placeholder')}
                        isInvalid={errors.organizationName}
                      />
                      {errors.organizationName && <ValidationError value={errors.organizationName?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='candidate-organization-website'>
                      <label className='form-field-label required-field' htmlFor='website'>
                        {format('ui.candidateOrganization.website')}
                      </label>
                      <Controller
                        name='website'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <UrlInput
                            value={value}
                            onChange={onChange}
                            id='website'
                            isInvalid={errors.website}
                            placeholder={format('ui.candidateOrganization.website.placeholder')}
                          />
                        )}
                        rules={{ required: format('validation.required') }}
                      />
                      {errors.website && <ValidationError value={errors.website?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='candidate-organization-name'>
                      <label className='form-field-label required-field' htmlFor='name'>
                        {format('ui.candidateOrganization.name')}
                      </label>
                      <Input
                        {...register('name', { required: format('validation.required') })}
                        id='name'
                        placeholder={format('ui.candidateOrganization.name.placeholder')}
                        isInvalid={errors.name}
                      />
                      {errors.name && <ValidationError value={errors.name?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='candidate-organization-email'>
                      <label className='form-field-label required-field' htmlFor='email'>
                        {format('ui.candidateOrganization.email')}
                      </label>
                      <Input
                        type='email'
                        {...register('email',
                          {
                            required: format('validation.required'),
                            validate: value => validate(value) || format('validation.email')
                          }
                        )}
                        id='email'
                        placeholder={format('ui.candidateOrganization.email.placeholder')}
                        isInvalid={errors.email}
                      />
                      {errors.email && <ValidationError value={errors.email?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='candidate-organization-title'>
                      <label className='form-field-label required-field' htmlFor='title'>
                        {format('ui.candidateOrganization.title')}
                      </label>
                      <Input
                        {...register('title', { required: format('validation.required') })}
                        id='title'
                        placeholder={format('ui.candidateOrganization.title.placeholder')}
                        isInvalid={errors.title}
                      />
                      {errors.title && <ValidationError value={errors.title?.message} />}
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
                  <div
                    className='w-full lg:w-2/3'
                    style={{ minHeight: '20rem' }}
                    data-testid='candidate-organization-description'
                  >
                    <label className='block text-dial-sapphire flex flex-col gap-y-2'>
                      <p className='required-field'> {format('ui.candidateOrganization.description')}</p>
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
                              placeholder={format('ui.candidateOrganization.description.placeholder')}
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
                    {format('ui.candidateOrganization.submit')}
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
  )}

export default OrganizationForm

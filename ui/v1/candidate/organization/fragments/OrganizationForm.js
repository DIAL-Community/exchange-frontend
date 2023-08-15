import React, { useState, useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { ToastContext } from '../../../../../lib/ToastContext'
import { useUser } from '../../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../../components/shared/FetchStatus'
import Input from '../../../shared/form/Input'
import ValidationError from '../../../shared/form/ValidationError'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { CREATE_CANDIDATE_ORGANIZATION } from '../../../shared/mutation/candidateOrganization'
import UrlInput from '../../../shared/form/UrlInput'

const OrganizationForm = React.memo(({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const captchaRef = useRef()
  const [captchaValue, setCaptchaValue] = useState()

  const slug = organization?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateOrganization, { reset }] = useMutation(CREATE_CANDIDATE_ORGANIZATION, {
    onCompleted: (data) => {
      const { createCandidateOrganization: response } = data
      if (response.candidateOrganization && response.errors.length === 0) {
        const redirectPath = `/${locale}` +
                             `/candidate/organizations/${response.candidateOrganization.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showToast(
          format('ui.candidateOrganization.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          redirectHandler
        )
      } else {
        setMutating(false)
        showToast(format('ui.candidateOrganization.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('ui.candidateOrganization.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const [submitter] = organization ? organization.contacts : []

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
      organizationName: organization?.name ?? '',
      website: organization?.website ?? '',
      description: organization?.description ?? '',
      name: submitter?.name ?? '',
      email: submitter?.email ?? '',
      title: submitter?.title ?? ''
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        website,
        description,
        organizationName,
        name,
        email,
        title
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        slug,
        organizationName,
        website,
        description,
        name,
        email,
        title,
        captcha: captchaValue
      }

      updateOrganization({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            'Authorization': `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const updateCaptchaData = (value) => {
    setCaptchaValue(value)
  }

  const cancelForm = () => {
    if (organization) {
      setReverting(true)
      router.push(`/${locale}/candidate/organizations/${slug}`)
    }
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {organization
              ? format('app.editEntity', { entity: organization.name })
              : `${format('app.createNew')} ${format('ui.organization.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='organizationName'>
              {format('ui.candidateOrganization.organizationName')}
            </label>
            <Input
              id='organizationName'
              {...register('organizationName', { required: format('validation.required') })}
              placeholder={format('ui.candidateOrganization.organizationName.placeholder')}
              isInvalid={errors.organizationName}
            />
            {errors.organizationName && <ValidationError value={errors.organizationName?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='website'>
              {format('organization.website')}
            </label>
            <Controller
              name='website'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='website'
                  value={value}
                  onChange={onChange}
                  isInvalid={errors.website}
                  placeholder={format('ui.candidateOrganization.website.placeholder')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.website && <ValidationError value={errors.website?.message} />}
          </div>
          <div className='block flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field'>
              {format('organization.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('ui.candidateOrganization.description.placeholder')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <hr className='bg-dial-blue-chalk mt-6 mb-3' />
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.candidateOrganization.name')}
            </label>
            <Input
              id='name'
              {...register('name', { required: format('validation.required') })}
              placeholder={format('ui.candidateOrganization.name.placeholder')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='email'>
              {format('ui.candidateOrganization.email')}
            </label>
            <Input
              id='email'
              {...register('email', { required: format('validation.required') })}
              placeholder={format('ui.candidateOrganization.email.placeholder')}
              isInvalid={errors.email}
            />
            {errors.email && <ValidationError value={errors.email?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='title'>
              {format('ui.candidateOrganization.title')}
            </label>
            <Input
              id='title'
              {...register('title')}
              placeholder={format('ui.candidateOrganization.title.placeholder')}
            />
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
              {`${format('app.submit')} ${format('ui.organization.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            {organization &&
              <button
                type='button'
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
  ) : (
    <Unauthorized />
  )
})

OrganizationForm.displayName = 'OrganizationForm'

export default OrganizationForm

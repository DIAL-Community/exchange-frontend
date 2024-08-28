import React, { useCallback, useContext, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import Input from '../../../shared/form/Input'
import Select from '../../../shared/form/Select'
import UrlInput from '../../../shared/form/UrlInput'
import ValidationError from '../../../shared/form/ValidationError'
import { CREATE_CANDIDATE_RESOURCE } from '../../../shared/mutation/candidateResource'
import {
  CANDIDATE_RESOURCE_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_CANDIDATE_RESOURCES_QUERY
} from '../../../shared/query/candidateResource'
import { RESOURCE_TYPE_SEARCH_QUERY } from '../../../shared/query/resource'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import { fetchSelectOptions } from '../../../utils/search'
import Pill from '../../../shared/form/Pill'
import { COUNTRY_SEARCH_QUERY } from '../../../shared/query/country'

const ResourceForm = React.memo(({ candidateResource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const captchaRef = useRef()
  const [captchaValue, setCaptchaValue] = useState()

  const slug = candidateResource?.slug ?? ''

  const client = useApolloClient()

  const { user, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [resourceType, setResourceType] = useState({
    value: candidateResource?.resourceType,
    label:  candidateResource?.resourceType
  })
  const fetchedResourceTypesCallback = (data) => (
    data.resourceTypes?.map((resourceType) => ({
      value: resourceType.name,
      label: resourceType.name
    }))
  )

  const [updateResource, { reset }] = useMutation(CREATE_CANDIDATE_RESOURCE, {
    refetchQueries: [{
      query: CANDIDATE_RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_CANDIDATE_RESOURCES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { createCandidateResource: response } = data
      if (response.candidateResource && response.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}` +
                             `/candidate/resources/${response.candidateResource.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.candidateResource.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateResource.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateResource.label') }))
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
      name: candidateResource?.name ?? '',
      publishedDate: candidateResource?.publishedDate,
      resourceLink: candidateResource?.resourceLink ?? '',
      linkDescription: candidateResource?.linkDescription ?? '',
      submitterEmail: candidateResource?.submitterEmail ?? '',
      description: candidateResource?.description ?? ''
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
        description,
        resourceLink,
        linkDescription,
        publishedDate,
        submitterEmail
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        description,
        resourceLink,
        linkDescription,
        resourceType: resourceType?.value,
        countrySlugs: countries.map((country) => country.slug),
        publishedDate,
        submitterEmail,
        captcha: captchaValue
      }

      updateResource({
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
    if (candidateResource) {
      setReverting(true)
      router.push(`/${locale}/candidate/resources/${slug}`)
    }
  }

  const fetchedResourceTopicsCallback = (data) => (
    data.countries?.map((country) => ({
      id: country.id,
      name: country.name,
      slug: country.slug,
      label: country.name
    }))
  )

  const [countries, setCountries] = useState(() => (candidateResource?.countries ?? []))
  const removeCountry = (country) => {
    setCountries((countries) => countries.filter(({ slug }) => country.slug !== slug))
  }

  const addCountry = (country) => {
    setCountries((countries) => ([
      ...[
        ...countries.filter(({ id }) => id !== country.id),
        { id: country.id, name: country.name, slug: country.slug  }
      ]
    ]))
  }

  return loadingUserSession
    ? <Loading />
    : user
      ? <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {candidateResource
                ? format('app.editEntity', { entity: candidateResource.name })
                : `${format('app.createNew')} ${format('ui.candidateResource.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('ui.candidateResource.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('ui.candidateResource.name')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field'>
                {format('ui.candidateResource.publishedDate')}
              </label>
              <Input
                {...register('publishedDate', { required: format('validation.required') })}
                type='date'
                placeholder={format('ui.candidateResource.publishedDate.placeholder')}
                isInvalid={errors.publishedDate}
                defaultValue={new Date().toISOString().substring(0, 10)}
              />
              {errors.publishedDate && <ValidationError value={errors.publishedDate?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='resourceLink'>
                {format('ui.candidateResource.resourceLink')}
              </label>
              <Controller
                name='resourceLink'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    value={value}
                    onChange={onChange}
                    id='resourceLink'
                    isInvalid={errors.resourceLink}
                    placeholder={format('ui.candidateResource.resourceLink.placeholder')}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.resourceLink && <ValidationError value={errors.resourceLink?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('ui.candidateResource.linkDescription')}
              </label>
              <Input
                {...register('linkDescription', { required: format('validation.required') })}
                id='linkDescription'
                placeholder={format('ui.candidateResource.linkDescription.placeholder')}
                isInvalid={errors.name}
              />
              {errors.linkDescription && <ValidationError value={errors.linkDescription?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='resourceTopic'>
                {format('ui.candidateResource.resourceType')}
              </label>
              <Select
                async
                isSearch
                isBorderless
                defaultOptions
                cacheOptions
                placeholder={format('ui.candidateResource.resourceType.placeholder')}
                loadOptions={(input) =>
                  fetchSelectOptions(client, input, RESOURCE_TYPE_SEARCH_QUERY, fetchedResourceTypesCallback)
                }
                noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.candidateResource.resourceTopic') })}
                onChange={(value) => setResourceType(value)}
                value={resourceType}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='description-editor'>
                {format('ui.candidateResource.description')}
              </label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('ui.candidateResource.description.placeholder')}
                    isInvalid={errors.description}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.description && <ValidationError value={errors.description?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='flex flex-col gap-y-2'>
                {format('ui.country.header')}
                <Select
                  async
                  isSearch
                  isBorderless
                  defaultOptions
                  cacheOptions
                  placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
                  loadOptions={(input) =>
                    fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedResourceTopicsCallback)
                  }
                  noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.country.label') })}
                  onChange={addCountry}
                  value={null}
                />
              </label>
              <div className='flex flex-wrap gap-3'>
                {countries.map((country, countryIdx) => (
                  <Pill
                    key={`resource-topic-${countryIdx}`}
                    label={country.name}
                    onRemove={() => removeCountry(country)}
                  />
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='submitterEmail'>
                {format('ui.candidateResource.submitter')}
              </label>
              <Input
                {...register('submitterEmail', { required: format('validation.required') })}
                id='submitterEmail'
                placeholder={format('ui.candidateResource.submitter.placeholder')}
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
                {`${format('app.submit')} ${format('ui.candidateResource.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              {candidateResource &&
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
      : <Unauthorized />
})

ResourceForm.displayName = 'ResourceForm'

export default ResourceForm

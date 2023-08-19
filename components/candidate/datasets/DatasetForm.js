import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import { validate } from 'email-validator'
import ReCAPTCHA from 'react-google-recaptcha'
import Link from 'next/link'
import { HtmlEditor } from '../../shared/HtmlEditor'
import Input from '../../shared/Input'
import { ToastContext } from '../../../lib/ToastContext'
import ValidationError from '../../shared/ValidationError'
import Select from '../../shared/Select'
import { useUser } from '../../../lib/hooks'
import { CREATE_CANDIDATE_DATASET } from '../../../mutations/dataset'
import UrlInput from '../../shared/UrlInput'
import { Unauthorized } from '../../shared/FetchStatus'
import { getDatasetTypeOptions } from '../../../lib/utilities'
import { BREADCRUMB_SEPARATOR } from '../../shared/breadcrumb'

const DatasetForm = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const captchaRef = useRef(null)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()

  const [createCandidateDataset, { reset }] = useMutation(CREATE_CANDIDATE_DATASET, {
    onError: () => {
      setMutating(false)
      showToast(
        format('ui.candidateDataset.submit.failure'),
        'error',
        'top-center',
        1000
      )
      reset()
    },
    onCompleted: () => {
      setMutating(false)
      showToast(
        format('ui.candidateDataset.submit.success'),
        'success',
        'top-center',
        1000,
        null,
        () => router.push('/datasets')
      )
    }
  })

  const datasetTypeOptions = useMemo(() => getDatasetTypeOptions(format), [format])

  const { handleSubmit, register, control, setValue, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: '',
      website: '',
      visualizationUrl: '',
      datasetType: datasetTypeOptions[0],
      submitterEmail: '',
      description: '',
      captcha: null
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const captcha = captchaRef.current.getValue()

      const { userEmail, userToken } = user
      const {
        name,
        website,
        visualizationUrl,
        datasetType,
        submitterEmail,
        description
      } = data

      createCandidateDataset({
        variables: {
          name,
          slug: '',
          website,
          visualizationUrl,
          datasetType: datasetType.value,
          submitterEmail,
          description,
          captcha
        },
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
    router.push('/datasets')
  }

  useEffect(() => {
    register('captcha', { required: format('validation.required') })
  }, [register, format])

  return user ? (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <div className='bg-white pb-3 lg:py-4 whitespace-nowrap text-ellipsis overflow-hidden'>
          <Link href='/' className='inline text-dial-blue h5'>
            {format('app.home')}
          </Link>
          <div className='inline h5'>
            {BREADCRUMB_SEPARATOR}
            <Link href='/datasets' className='text-dial-blue'>
              {format('ui.dataset.header')}
            </Link>
            {BREADCRUMB_SEPARATOR}
            <span className='text-dial-gray-dark'>
              {format('app.create')}
            </span>
          </div>
        </div>
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {format('ui.candidateDataset.label')}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='candidate-dataset-name'>
                    <label className='form-field-label required-field' htmlFor='name'>
                      {format('ui.dataset.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('ui.dataset.name')}
                      isInvalid={errors.name}
                      data-testid='dataset-name-input'
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-dataset-website'>
                    <label className='form-field-label required-field' htmlFor='website'>
                      {format('ui.dataset.website')}
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
                          placeholder={format('ui.dataset.website')}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.website && <ValidationError value={errors.website?.message} />}
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label' htmlFor='dataVisualizationUrl'>
                      {format('ui.dataset.visualizationUrl')}
                    </label>
                    <Controller
                      name='dataVisualizationUrl'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          value={value}
                          onChange={onChange}
                          id='dataVisualizationUrl'
                          placeholder={format('ui.dataset.visualizationUrl')}
                        />
                      )}
                    />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('ui.dataset.datasetType')}
                    </label>
                    <Controller
                      name='dataType'
                      control={control}
                      render={({ field }) =>
                        <Select {...field} options={datasetTypeOptions} placeholder={format('ui.dataset.datasetType')} />
                      }
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='candidate-dataset-email'>
                    <label className='form-field-label required-field' htmlFor='email'>
                      {format('app.email')}
                    </label>
                    <Input
                      {...register('submitterEmail',
                        {
                          required: format('validation.required'),
                          validate: value => validate(value) || format('validation.email')
                        }
                      )}
                      id='email'
                      placeholder={format('app.email')}
                      isInvalid={errors.submitterEmail}
                    />
                    {errors.submitterEmail && <ValidationError value={errors.submitterEmail?.message} />}
                  </div>
                  <div className='form-field-wrapper'>
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                      ref={captchaRef}
                      onChange={value => {
                        setValue('captcha', value, { shouldValidate: true })
                      }}
                    />
                    {errors.captcha && <ValidationError value={errors.captcha?.message} />}
                  </div>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='form-field-wrapper' data-testid='candidate-dataset-description'>
                    <label className='form-field-label required-field'>
                      {format('ui.dataset.description')}
                    </label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('ui.dataset.description')}
                          isInvalid={errors.description}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.description && <ValidationError value={errors.description?.message} />}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap text-xl mt-8 gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
                >
                  {format('ui.candidateDataset.submit')}
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
          </form>
        </div>
      </div>
    </div>
  ) : <Unauthorized />
}

export default DatasetForm

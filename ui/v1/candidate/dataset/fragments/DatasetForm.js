import React, { useState, useCallback, useContext, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import {  FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { ToastContext } from '../../../../../lib/ToastContext'
import { useUser } from '../../../../../lib/hooks'
import Input from '../../../shared/form/Input'
import ValidationError from '../../../shared/form/ValidationError'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { CREATE_CANDIDATE_DATASET } from '../../../shared/mutation/candidateDataset'
import Select from '../../../shared/form/Select'
import UrlInput from '../../../shared/form/UrlInput'
import { generateDatasetTypeOptions } from '../../../shared/form/options'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import {
  CANDIDATE_DATASET_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_CANDIDATE_DATASETS_QUERY
} from '../../../shared/query/candidateDataset'

const DatasetForm = React.memo(({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const captchaRef = useRef()
  const [captchaValue, setCaptchaValue] = useState()

  const slug = dataset?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateDataset, { reset }] = useMutation(CREATE_CANDIDATE_DATASET, {
    refetchQueries: [{
      query: CANDIDATE_DATASET_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_CANDIDATE_DATASETS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { createCandidateDataset: response } = data
      if (response.candidateDataset && response.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}` +
                             `/candidate/datasets/${response.candidateDataset.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.candidateDataset.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateDataset.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateDataset.label') }))
      setMutating(false)
      reset()
    }
  })

  const datasetTypeOptions = useMemo(() => generateDatasetTypeOptions(format), [format])

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
      name: dataset?.name ?? '',
      website: dataset?.website ?? '',
      visualizationUrl: dataset?.visualizationUrl ?? '',
      datasetType: datasetTypeOptions.find(({ value }) => value === dataset?.datasetType) ?? datasetTypeOptions[0],
      submitterEmail: dataset?.submitterEmail ?? '',
      description: dataset?.description ?? ''
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
        visualizationUrl,
        datasetType,
        submitterEmail,
        description
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        website,
        visualizationUrl,
        datasetType: datasetType.value,
        submitterEmail,
        description,
        captcha: captchaValue
      }

      updateDataset({
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
    if (dataset) {
      setReverting(true)
      router.push(`/${locale}/candidate/datasets/${slug}`)
    }
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {dataset
                ? format('app.editEntity', { entity: dataset.name })
                : `${format('app.createNew')} ${format('ui.dataset.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('ui.dataset.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('ui.dataset.name')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='website'>
                {format('ui.candidateDataset.website.hint')}
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
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='visualizationUrl'>
                {format('ui.candidateDataset.visualizationUrl.hint')}
              </label>
              <Controller
                name='visualizationUrl'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    value={value}
                    onChange={onChange}
                    id='visualizationUrl'
                    placeholder={format('ui.dataset.visualizationUrl')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='datasetType'>
                {format('ui.candidateDataset.datasetType.hint')}
              </label>
              <Controller
                name='datasetType'
                control={control}
                render={({ field }) =>
                  <Select {...field}
                    id='datasetType'
                    options={datasetTypeOptions}
                    placeholder={format('ui.dataset.datasetType')}
                  />
                }
              />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='description-editor'>
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
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='submitterEmail'>
                {format('ui.candidateDataset.submitter.hint')}
              </label>
              <Input
                {...register('submitterEmail', { required: format('validation.required') })}
                id='submitterEmail'
                placeholder={format('ui.candidateDataset.submitter.hint')}
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
                {`${format('app.submit')} ${format('ui.dataset.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              {dataset &&
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

DatasetForm.displayName = 'DatasetForm'

export default DatasetForm

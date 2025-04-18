import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { ToastContext } from '../../../../lib/ToastContext'
import { CustomMCaptcha } from '../../../shared/CustomMCaptcha'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import Input from '../../../shared/form/Input'
import { generateDatasetTypeOptions } from '../../../shared/form/options'
import Select from '../../../shared/form/Select'
import UrlInput from '../../../shared/form/UrlInput'
import ValidationError from '../../../shared/form/ValidationError'
import { CREATE_CANDIDATE_DATASET } from '../../../shared/mutation/candidateDataset'
import {
  CANDIDATE_DATASET_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_CANDIDATE_DATASETS_QUERY
} from '../../../shared/query/candidateDataset'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'

const DatasetForm = memo(({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = dataset?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateDataset, { reset }] = useMutation(CREATE_CANDIDATE_DATASET, {
    refetchQueries: [{
      query: CANDIDATE_DATASET_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_CANDIDATE_DATASETS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
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
    mode: 'onBlur',
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
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
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
      captcha: captchaToken
    }

    updateDataset({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    if (dataset) {
      setReverting(true)
      router.push(`/${locale}/candidate/datasets/${slug}`)
    }
  }

  return (
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
            <label htmlFor='react-select-dataset-type'>
              {format('ui.candidateDataset.datasetType.hint')}
            </label>
            <Controller
              name='datasetType'
              control={control}
              render={({ field }) =>
                <Select {...field}
                  name='dataset-type'
                  options={datasetTypeOptions}
                  placeholder={format('ui.dataset.datasetType')}
                />
              }
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('ui.dataset.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('ui.dataset.description')}
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
          <CustomMCaptcha setCaptchaToken={setCaptchaToken} />
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button
              type='submit'
              className='submit-button'
              disabled={mutating || reverting || !captchaToken}
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
  )
})

DatasetForm.displayName = 'DatasetForm'

export default DatasetForm

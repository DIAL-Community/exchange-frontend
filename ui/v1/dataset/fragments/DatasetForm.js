import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_DATASET } from '../../shared/mutation/dataset'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Select from '../../shared/form/Select'
import { generateDatasetTypeOptions } from '../../shared/form/options'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import {
  DATASET_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_DATASETS_QUERY
} from '../../shared/query/dataset'

const DatasetForm = React.memo(({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = dataset?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateDataset, { reset }] = useMutation(CREATE_DATASET, {
    refetchQueries: [{
      query: DATASET_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_DATASETS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createDataset.dataset && data.createDataset.errors.length === 0) {
        const redirectPath = `/${locale}/datasets/${data.createDataset.dataset.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.dataset.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.dataset.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.dataset.label') }))
      setMutating(false)
      reset()
    }
  })

  const datasetTypeOptions = useMemo(() => generateDatasetTypeOptions(format), [format])

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: dataset?.name,
      aliases: dataset?.aliases?.length ? dataset?.aliases.map(value => ({ value })) : [{ value: '' }],
      datasetType: datasetTypeOptions.find(({ value }) => value === dataset?.datasetType) ?? datasetTypeOptions[0],
      website: dataset?.website,
      visualizationUrl: dataset?.visualizationUrl,
      geographicCoverage: dataset?.geographicCoverage,
      timeRange: dataset?.timeRange,
      license: dataset?.license,
      languages: dataset?.languages,
      dataFormat: dataset?.dataFormat,
      description: dataset?.datasetDescription?.description
    }
  })

  const {
    fields: aliases,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])
  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        aliases,
        website,
        visualizationUrl,
        geographicCoverage,
        timeRange,
        datasetType,
        license,
        languages,
        dataFormat,
        description,
        imageFile
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        visualizationUrl,
        geographicCoverage,
        timeRange,
        datasetType: datasetType.value,
        license,
        languages,
        dataFormat,
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
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

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/datasets/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {dataset
                  ? format('app.editEntity', { entity: dataset.name })
                  : `${format('app.createNew')} ${format('ui.dataset.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
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
                <label className='text-dial-sapphire'>{format('ui.dataset.aliases')}</label>
                {aliases.map((alias, aliasIdx) => (
                  <div key={alias.id} className='flex gap-x-2'>
                    <Input
                      {...register(`aliases.${aliasIdx}.value`)}
                      placeholder={format('ui.dataset.alias')}
                    />
                    {isLastAlias(aliasIdx) && (
                      <span>
                        <IconButton icon={<FaPlus />} onClick={() => append({ value: '' })} />
                      </span>
                    )}
                    {!isSingleAlias && (
                      <span>
                        <IconButton icon={<FaMinus />} onClick={() => remove(aliasIdx)} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='website'>
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
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='visualizationUrl'>
                  {format('ui.dataset.visualizationUrl')}
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
                <label className='text-dial-sapphire'>
                  {format('ui.dataset.datasetType')}
                </label>
                <Controller
                  name='datasetType'
                  control={control}
                  render={({ field }) =>
                    <Select {...field}
                      options={datasetTypeOptions}
                      placeholder={format('ui.dataset.datasetType')}
                    />
                  }
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire'>
                  {format('ui.dataset.imageFile')}
                </label>
                <FileUploader {...register('imageFile')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='geographicCoverage'>
                  {format('ui.dataset.coverage')}
                </label>
                <Input
                  {...register('geographicCoverage')}
                  id='geographicCoverage'
                  placeholder={format('ui.dataset.coverage')}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='timeRange'>
                  {format('ui.dataset.timeRange')}
                </label>
                <Input
                  {...register('timeRange')}
                  id='timeRange'
                  placeholder={format('ui.dataset.timeRange')}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='license'>
                  {format('ui.dataset.license')}
                </label>
                <Input
                  {...register('license')}
                  id='license'
                  placeholder={format('ui.dataset.license')}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='languages'>
                  {format('ui.dataset.languages')}
                </label>
                <Input
                  {...register('languages')}
                  id='languages'
                  placeholder={format('ui.dataset.languages')}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='dataFormat'>
                  {format('ui.dataset.dataFormat')}
                </label>
                <Input
                  {...register('dataFormat')}
                  id='dataFormat'
                  placeholder={format('ui.dataset.dataFormat')}
                />
              </div>
              <div className='block flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field'>
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
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.dataset.label')}`}
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
      : <Unauthorized />
})

DatasetForm.displayName = 'DatasetForm'

export default DatasetForm

import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner, FaPlus, FaMinus } from 'react-icons/fa'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import IconButton from '../shared/IconButton'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { CREATE_DATASET } from '../../mutations/dataset'
import Select from '../shared/Select'
import FileUploader from '../shared/FileUploader'
import { getDatasetTypeOptions } from '../../lib/utilities'
import { useUser } from '../../lib/hooks'
import UrlInput from '../shared/UrlInput'

const DatasetForm = React.memo(({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()
  const [updateDataset, { reset }] = useMutation(CREATE_DATASET, {
    onCompleted: (data) => {
      const { createDataset: response } = data
      if (response?.errors?.length <= 0 && response?.dataset) {
        setMutating(false)
        showToast(
          format('dataset.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`/${router.locale}/datasets/${response?.dataset.slug}`)
        )
      } else if (response?.errors?.length > 0) {
        setMutating(false)
        showToast(
          <div className='flex flex-col'>
            <span>{format('dataset.submit.failure')}</span>
            {data?.createDataset?.errors.map((error, errorIdx) => (
              <span key={errorIdx}>{error}</span>
            ))}
          </div>,
          'error',
          'top-center'
        )
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('dataset.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const datasetTypeOptions = useMemo(() => getDatasetTypeOptions(format), [format])

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

  const slug = dataset?.slug ?? ''

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])

  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (dataset) {
      map[dataset.slug] = dataset.name
    }

    return map
  }, [dataset, format])

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
    let route = '/datasets'
    if (dataset) {
      route = `${route}/${dataset.slug}`
    }

    router.push(route)
  }

  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {dataset
                  ? format('app.editEntity', { entity: dataset.name })
                  : `${format('app.createNew')} ${format('dataset.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='dataset-name'>
                    <label className='form-field-label required-field' htmlFor='name'>
                      {format('dataset.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('dataset.name')}
                      isInvalid={errors.name}
                      data-testid='dataset-name-input'
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('dataset.aliases')}
                    </label>
                    {aliases.map((alias, aliasIdx) => (
                      <div key={alias.id} className='flex gap-x-2'>
                        <Input
                          {...register(`aliases.${aliasIdx}.value`)}
                          placeholder={format('dataset.aliases')}
                        />
                        {isLastAlias(aliasIdx) && (
                          <IconButton
                            icon={<FaPlus />}
                            onClick={() => append({ value: '' })}
                          />
                        )}
                        {!isSingleAlias && (
                          <IconButton
                            icon={<FaMinus />}
                            onClick={() => remove(aliasIdx)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-website'>
                    <label className='form-field-label required-field' htmlFor='website'>
                      {format('dataset.website')}
                    </label>
                    <Controller
                      name='website'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          value={value || ''}
                          onChange={onChange}
                          id='website'
                          placeholder={format('dataset.website')}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.website && <ValidationError value={errors.website?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-visualizationUrl'>
                    <label className='form-field-label' htmlFor='visualizationUrl'>
                      {format('dataset.visualizationUrl')}
                    </label>
                    <Controller
                      name='visualizationUrl'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          value={value}
                          onChange={onChange}
                          id='visualizationUrl'
                          placeholder={format('dataset.visualizationUrl')}
                        />
                      )}
                    />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('dataset.datasetType')}
                    </label>
                    <Controller
                      name='datasetType'
                      control={control}
                      render={({ field }) =>
                        <Select {...field} options={datasetTypeOptions} placeholder={format('dataset.datasetType')} />
                      }
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-logo'>
                    <label className='form-field-label'>
                      {format('dataset.imageFile')}
                    </label>
                    <FileUploader {...register('imageFile')} />
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-geographicCoverage'>
                    <label className='form-field-label' htmlFor='geographicCoverage'>
                      {format('dataset.coverage')}
                    </label>
                    <Input
                      {...register('geographicCoverage')}
                      id='geographicCoverage'
                      placeholder={format('dataset.coverage')}
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-timeRange'>
                    <label className='form-field-label' htmlFor='timeRange'>
                      {format('dataset.timeRange')}
                    </label>
                    <Input
                      {...register('timeRange')}
                      id='timeRange'
                      placeholder={format('dataset.timeRange')}
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-license'>
                    <label className='form-field-label' htmlFor='license'>
                      {format('dataset.license')}
                    </label>
                    <Input
                      {...register('license')}
                      id='license'
                      placeholder={format('dataset.license')}
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-languages'>
                    <label className='form-field-label' htmlFor='languages'>
                      {format('dataset.languages')}
                    </label>
                    <Input
                      {...register('languages')}
                      id='languages'
                      placeholder={format('dataset.languages')}
                    />
                  </div>
                  <div className='form-field-wrapper' data-testid='dataset-dataFormat'>
                    <label className='form-field-label' htmlFor='dataFormat'>
                      {format('dataset.dataFormat')}
                    </label>
                    <Input
                      {...register('dataFormat')}
                      id='dataFormat'
                      placeholder={format('dataset.dataFormat')}
                    />
                  </div>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='form-field-wrapper' data-testid='dataset-description'>
                    <label className='form-field-label required-field'>
                      {format('dataset.description')}
                    </label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('dataset.description')}
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
                  {`${format('dataset.submit')} ${format('dataset.label')}`}
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
  )
})

DatasetForm.displayName = 'DatasetForm'

export default DatasetForm

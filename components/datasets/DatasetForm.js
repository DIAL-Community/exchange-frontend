import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
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

const DatasetForm = React.memo(({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id: id }, values), [formatMessage])

  const router = useRouter()
  const [session] = useSession()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()
  const [updateDataset, { data }] = useMutation(CREATE_DATASET)

  const datasetTypeOptions = [
    { label: format('dataset.type.dataset'), value: 'dataset' },
    { label: format('dataset.type.content'), value: 'content' },
    { label: format('dataset.type.standard'), value: 'standard' },
    { label: format('dataset.type.aiModel'), value: 'ai_model' }
  ]

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

  useEffect(() => {
    if (!data?.createDataset?.errors.length && data?.createDataset?.dataset) {
      showToast(
        format('dataset.submit.success'),
        'success',
        'top-center',
        1000,
        null,
        () => router.push(`/${router.locale}/datasets/${data.createDataset.dataset.slug}`)
      )
    } else if (data?.createDataset?.errors.length) {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('dataset.submit.failure')}</span>
          {data?.createDataset?.errors.map((error, errorIdx) => (
            <span key={errorIdx}>{error}</span>
          ))}
        </div>,
        'error',
        'top-center',
        false
      )
    }
  }, [data, format, router, showToast])

  const doUpsert = async (data) => {
    if (session) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = session.user
      const { name, aliases, website, visualizationUrl, geographicCoverage, timeRange, datasetType, license, languages, dataFormat, description } = data
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
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {dataset
                  ? format('app.edit-entity', { entity: dataset.name })
                  : `${format('app.create-new')} ${format('dataset.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-name'>
                    <label className='text-xl text-dial-blue required-field' htmlFor='name'>
                      {format('dataset.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('dataset.name')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
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
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-website'>
                    <label className='text-xl text-dial-blue required-field' htmlFor='website'>
                      {format('dataset.website')}
                    </label>
                    <Input
                      {...register('website', { required: format('validation.required') })}
                      id='website'
                      placeholder={format('dataset.website')}
                      isInvalid={errors.website}
                    />
                    {errors.website && <ValidationError value={errors.website?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-visualizationUrl'>
                    <label className='text-xl text-dial-blue' htmlFor='visualizationUrl'>
                      {format('dataset.visualizationUrl')}
                    </label>
                    <Input
                      {...register('visualizationUrl')}
                      id='visualizationUrl'
                      placeholder={format('dataset.visualizationUrl')}
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
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
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-geographicCoverage'>
                    <label className='text-xl text-dial-blue' htmlFor='geographicCoverage'>
                      {format('dataset.coverage')}
                    </label>
                    <Input
                      {...register('geographicCoverage')}
                      id='geographicCoverage'
                      placeholder={format('dataset.coverage')}
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-timeRange'>
                    <label className='text-xl text-dial-blue' htmlFor='timeRange'>
                      {format('dataset.timeRange')}
                    </label>
                    <Input
                      {...register('timeRange')}
                      id='timeRange'
                      placeholder={format('dataset.timeRange')}
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-license'>
                    <label className='text-xl text-dial-blue' htmlFor='license'>
                      {format('dataset.license')}
                    </label>
                    <Input
                      {...register('license')}
                      id='license'
                      placeholder={format('dataset.license')}
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-languages'>
                    <label className='text-xl text-dial-blue' htmlFor='languages'>
                      {format('dataset.languages')}
                    </label>
                    <Input
                      {...register('languages')}
                      id='languages'
                      placeholder={format('dataset.languages')}
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='dataset-dataFormat'>
                    <label className='text-xl text-dial-blue' htmlFor='dataFormat'>
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
                  <div className='block flex flex-col gap-y-2' data-testid='dataset-description'>
                    <label className='text-xl text-dial-blue required-field'>
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

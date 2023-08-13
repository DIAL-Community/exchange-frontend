import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_CITY } from '../../shared/mutation/city'
import { REBRAND_BASE_PATH } from '../../utils/constants'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Select from '../../shared/form/Select'
import { generateCityTypeOptions } from '../../shared/form/options'

const CityForm = React.memo(({ city }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = city?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateCity, { reset }] = useMutation(CREATE_CITY, {
    onCompleted: (data) => {
      if (data.createCity.city && data.createCity.errors.length === 0) {
        const redirectPath = `/${router.locale}/cities/${data.createCity.city.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showToast(
          format('city.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          redirectHandler
        )
      } else {
        setMutating(false)
        showToast(format('city.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('city.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const cityTypeOptions = useMemo(() => generateCityTypeOptions(format), [format])

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: city?.name,
      aliases: city?.aliases?.length ? city?.aliases.map(value => ({ value })) : [{ value: '' }],
      cityType: cityTypeOptions.find(({ value }) => value === city?.cityType) ?? cityTypeOptions[0],
      website: city?.website,
      visualizationUrl: city?.visualizationUrl,
      geographicCoverage: city?.geographicCoverage,
      timeRange: city?.timeRange,
      license: city?.license,
      languages: city?.languages,
      dataFormat: city?.dataFormat,
      description: city?.cityDescription?.description
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
        cityType,
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
        cityType: cityType.value,
        license,
        languages,
        dataFormat,
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateCity({
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
    router.push(`${REBRAND_BASE_PATH}/cities/${slug}`)
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {city
              ? format('app.editEntity', { entity: city.name })
              : `${format('app.createNew')} ${format('city.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('city.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('city.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('city.aliases')}</label>
            {aliases.map((alias, aliasIdx) => (
              <div key={alias.id} className='flex gap-x-2'>
                <Input
                  {...register(`aliases.${aliasIdx}.value`)}
                  placeholder={format('city.alias')}
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
              {format('city.website')}
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
                  placeholder={format('city.website')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.website && <ValidationError value={errors.website?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='visualizationUrl'>
              {format('city.visualizationUrl')}
            </label>
            <Controller
              name='visualizationUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  value={value}
                  onChange={onChange}
                  id='visualizationUrl'
                  placeholder={format('city.visualizationUrl')}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>
              {format('city.cityType')}
            </label>
            <Controller
              name='cityType'
              control={control}
              render={({ field }) =>
                <Select {...field}
                  options={cityTypeOptions}
                  placeholder={format('city.cityType')}
                />
              }
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>
              {format('city.imageFile')}
            </label>
            <FileUploader {...register('imageFile')} />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='geographicCoverage'>
              {format('city.coverage')}
            </label>
            <Input
              {...register('geographicCoverage')}
              id='geographicCoverage'
              placeholder={format('city.coverage')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='timeRange'>
              {format('city.timeRange')}
            </label>
            <Input
              {...register('timeRange')}
              id='timeRange'
              placeholder={format('city.timeRange')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='license'>
              {format('city.license')}
            </label>
            <Input
              {...register('license')}
              id='license'
              placeholder={format('city.license')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='languages'>
              {format('city.languages')}
            </label>
            <Input
              {...register('languages')}
              id='languages'
              placeholder={format('city.languages')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='dataFormat'>
              {format('city.dataFormat')}
            </label>
            <Input
              {...register('dataFormat')}
              id='dataFormat'
              placeholder={format('city.dataFormat')}
            />
          </div>
          <div className='block flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field'>
              {format('city.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('city.description')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('city.label')}`}
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
  ) : (
    <Unauthorized />
  )
})

CityForm.displayName = 'CityForm'

export default CityForm

import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_CITY } from '../../shared/mutation/city'
import { CITY_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_CITIES_QUERY } from '../../shared/query/city'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const CityForm = React.memo(({ city }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = city?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateCity, { reset }] = useMutation(CREATE_CITY, {
    refetchQueries: [{
      query: CITY_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_CITIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createCity.city && data.createCity.errors.length === 0) {
        const redirectPath = `/${locale}/cities/${data.createCity.city.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.city.label') }),
          redirectHandler
        )
        setMutating(false)
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.city.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.city.label') }))
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      cityName: city?.name,
      provinceName: city?.province?.name,
      countryName: city?.province?.country?.name
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const { cityName, provinceName, countryName } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      slug,
      cityName,
      provinceName,
      countryName
    }

    updateCity({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/cities/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {city
              ? format('app.editEntity', { entity: city.name })
              : `${format('app.createNew')} ${format('ui.city.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='cityName'>
              {format('ui.city.label')}
            </label>
            <Input
              {...register('cityName', { required: format('validation.required') })}
              id='cityName'
              placeholder={format('ui.city.label')}
              isInvalid={errors.cityName}
            />
            {errors.cityName && <ValidationError value={errors.cityName?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='provinceName'>
              {format('ui.province.label')}
            </label>
            <Input
              {...register('provinceName', { required: format('validation.required') })}
              id='provinceName'
              placeholder={format('ui.province.label')}
              isInvalid={errors.provinceName}
            />
            {errors.provinceName && <ValidationError value={errors.provinceName?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='countryName'>
              {format('ui.country.label')}
            </label>
            <Input
              {...register('countryName', { required: format('validation.required') })}
              id='countryName'
              placeholder={format('ui.country.label')}
              isInvalid={errors.countryName}
            />
            {errors.countryName && <ValidationError value={errors.countryName?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.city.label')}`}
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
})

CityForm.displayName = 'CityForm'

export default CityForm

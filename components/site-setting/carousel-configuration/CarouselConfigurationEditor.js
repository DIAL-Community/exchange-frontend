import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATION } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'

const CarouselConfigurationEditor = (props) => {
  const { siteSettingSlug, carouselConfiguration } = props
  const { carouselConfigurations, setCarouselConfigurations } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const textStyleSelections = [{
    value: 'left-aligned',
    label: format('ui.siteSetting.carousel.textStyle.leftAligned')
  }, {
    value: 'right-aligned',
    label: format('ui.siteSetting.carousel.textStyle.rightAligned')
  }, {
    value: 'center-aligned',
    label: format('ui.siteSetting.carousel.textStyle.centered')
  }]

  const bgStyleSelections = [{
    value: 'style-1',
    label: `${format('ui.siteSetting.carousel.bgStyle')} 1`
  }, {
    value: 'style-2',
    label: `${format('ui.siteSetting.carousel.bgStyle')} 2`
  }, {
    value: 'style-3',
    label: `${format('ui.siteSetting.carousel.bgStyle')} 3`
  }, {
    value: 'style-4',
    label: `${format('ui.siteSetting.carousel.bgStyle')} 4`
  }, {
    value: 'style-5',
    label: `${format('ui.siteSetting.carousel.bgStyle')} 5`
  }]

  const { locale } = useRouter()
  const [updateExchangeCarousel, { reset }] = useMutation(UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATION, {
    refetchQueries: [{
      query: SITE_SETTING_DETAIL_QUERY,
      variables: { slug: siteSettingSlug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { updateSiteSettingCarouselConfiguration: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        setMutating(false)
        showSuccessMessage(format('ui.siteSetting.carousel.submitted'))
        setCarouselConfigurations([...response.siteSetting.carouselConfigurations])
      } else {
        const [firstErrorMessage] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: carouselConfiguration?.name,
      title: carouselConfiguration?.title,
      external: carouselConfiguration?.external,
      description: carouselConfiguration?.description,
      destinationUrl: carouselConfiguration?.destinationUrl,
      calloutTitle: carouselConfiguration?.calloutTitle,
      textStyle: textStyleSelections.find(option => option.value === carouselConfiguration?.style),
      bgStyle: bgStyleSelections.find(option => option.value === carouselConfiguration?.imageUrl),
      imageUrl: carouselConfiguration?.imageUrl.indexOf('/') >= 0
        ? carouselConfiguration?.imageUrl.replace(/\/\//, '')
        : null
    }
  })

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const { name, title, external, description, calloutTitle, destinationUrl, textStyle, bgStyle, imageUrl } = value
      const currentCarouselConfiguration = {
        ...carouselConfiguration,
        name: name ?? carouselConfiguration?.name,
        title: title ?? carouselConfiguration?.title,
        external: external ?? carouselConfiguration?.external,
        description: description ?? carouselConfiguration?.description,
        calloutTitle: calloutTitle ?? carouselConfiguration?.calloutTitle,
        destinationUrl: destinationUrl ?? carouselConfiguration?.destinationUrl,
        imageUrl: imageUrl ? `//${imageUrl}` : bgStyle?.value ?? carouselConfiguration?.imageUrl,
        style: textStyle?.value ?? carouselConfiguration?.style,
        saved: false
      }

      const currentCarouselConfigurations = [...carouselConfigurations]
      // Try to find the index in the top level carousel configurations
      let indexOfCarouselConfiguration = carouselConfigurations.findIndex(m => m.id === carouselConfiguration.id)
      if (indexOfCarouselConfiguration >= 0) {
        // Update at that index using the current carousel configuration.
        currentCarouselConfigurations[indexOfCarouselConfiguration] = currentCarouselConfiguration
      }

      setCarouselConfigurations([...currentCarouselConfigurations])
    })

    return () => unsubscribe()
  }, [watch, carouselConfiguration, carouselConfigurations, setCarouselConfigurations])

  // Watch the current external value to toggle between url input and standard text input.
  const currentExternalValue = watch('external')
  const currentImageUrlValue = watch('imageUrl')

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const { name, title, external, description, destinationUrl, calloutTitle, textStyle, bgStyle, imageUrl } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      siteSettingSlug,
      id: carouselConfiguration?.id,
      type: carouselConfiguration?.type,
      name: name ?? carouselConfiguration?.name,
      title: title ?? carouselConfiguration?.title,
      external: external ?? carouselConfiguration?.external,
      description: description ?? carouselConfiguration?.description,
      calloutTitle: calloutTitle ?? carouselConfiguration?.calloutTitle,
      destinationUrl: destinationUrl ?? carouselConfiguration?.destinationUrl,
      imageUrl: imageUrl ? `//${imageUrl}` : bgStyle?.value ?? carouselConfiguration?.imageUrl,
      style: textStyle ? textStyle?.value : carouselConfiguration?.style
    }
    updateExchangeCarousel({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-8 py-6'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {carouselConfiguration && format('app.editEntity', { entity: carouselConfiguration.name })}
            {!carouselConfiguration && `${format('app.createNew')} ${format('ui.siteSetting.carousel.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.siteSetting.carousel.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              disabled={
                carouselConfiguration?.type === 'default.exchange.carousel' ||
                carouselConfiguration?.type === 'default.marketplace.carousel'
              }
              placeholder={format('ui.siteSetting.carousel.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='title'>
              {format('ui.siteSetting.carousel.title')}
            </label>
            <Input
              {...register('title', { required: format('validation.required') })}
              id='title'
              placeholder={format('ui.siteSetting.carousel.title')}
              isInvalid={errors.title}
            />
            {errors.title && <ValidationError value={errors.title?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='description'>
              {format('ui.siteSetting.carousel.description')}
            </label>
            <Input
              {...register('description', { required: format('validation.required') })}
              id='description'
              placeholder={format('ui.siteSetting.carousel.description')}
              isInvalid={errors.description}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          {carouselConfiguration?.type !== 'default.exchange.carousel' &&
            <div className='flex flex-col gap-y-2'>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='calloutTitle'>
                  {format('ui.siteSetting.carousel.calloutTitle')}
                </label>
                <Input
                  {...register('calloutTitle')}
                  id='calloutTitle'
                  placeholder={format('ui.siteSetting.carousel.calloutTitle')}
                />
              </div>
              <label className='flex gap-x-2 mb-2 items-center self-start'>
                <Checkbox {...register('external')} />
                {format('ui.siteSetting.carousel.external')}
              </label>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='destinationUrl'>
                  {format('ui.siteSetting.carousel.destinationUrl')}
                </label>
                {currentExternalValue
                  ? <Controller
                    name='destinationUrl'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <UrlInput
                        value={value}
                        onChange={onChange}
                        id='destinationUrl'
                        placeholder={format('ui.siteSetting.carousel.destinationUrl')}
                      />
                    )}
                  />
                  : <Input
                    {...register('destinationUrl')}
                    id='destinationUrl'
                    placeholder={format('ui.siteSetting.carousel.destinationUrl')}
                  />
                }
              </div>
            </div>
          }
          {carouselConfiguration?.type !== 'default.exchange.carousel' &&
            carouselConfiguration?.type !== 'default.marketplace.carousel' &&
            <div className='flex flex-col lg:flex-row gap-2'>
              <div className='flex flex-col gap-y-2 basis-1/2 flex-shrink-0'>
                <label htmlFor='textStyle' className='required-field'>
                  {format('ui.siteSetting.carousel.textStyle')}
                </label>
                <Controller
                  name='textStyle'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id='textStyle'
                      name='textStyle'
                      isSearch
                      isBorderless
                      options={textStyleSelections}
                      placeholder={format('ui.siteSetting.carousel.textStyle')}
                      isInvalid={errors.textStyle}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.textStyle && <ValidationError value={errors.textStyle?.message} />}
              </div>
              <div className='flex flex-col gap-y-2 basis-1/2 flex-shrink-0'>
                <label htmlFor='bgStyle' className={`${!currentImageUrlValue ? 'required-field' : null}`}>
                  {format('ui.siteSetting.carousel.bgStyle')}
                </label>
                <Controller
                  name='bgStyle'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id='bgStyle'
                      name='bgStyle'
                      isSearch
                      isBorderless
                      options={bgStyleSelections}
                      placeholder={format('ui.siteSetting.carousel.bgStyle')}
                      isInvalid={errors.bgStyle}
                    />
                  )}
                  rules={{
                    required: {
                      value: !currentImageUrlValue,
                      message: format('validation.required')
                    }
                  }}
                />
                {errors.bgStyle && <ValidationError value={errors.bgStyle?.message} />}
              </div>
            </div>
          }
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='image-url'>
              {format('ui.siteSetting.carousel.imageUrl')}
            </label>
            <Controller
              id='image-url'
              name='imageUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='image-url'
                  value={value}
                  onChange={onChange}
                  placeholder={format('ui.siteSetting.carousel.imageUrl')}
                />
              )}
            />
          </div>
          <div className='flex flex-wrap text-sm gap-3'>
            <button type='submit' className='submit-button' disabled={mutating}>
              {format('ui.siteSetting.carousel.save')}
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CarouselConfigurationEditor

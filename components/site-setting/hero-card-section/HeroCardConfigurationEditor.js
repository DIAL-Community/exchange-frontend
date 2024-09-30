import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading } from '../../shared/FetchStatus'
import Checkbox from '../../shared/form/Checkbox'
import Input from '../../shared/form/Input'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { UPDATE_SITE_SETTING_HERO_CARD_CONFIGURATION } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'

const HeroCardConfigurationEditor = (props) => {
  const { siteSettingSlug, heroCardConfiguration } = props
  const { heroCardConfigurations, setHeroCardConfigurations } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const { user, loadingUserSession } = useUser()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [updateExchangeHeroCard, { reset }] = useMutation(UPDATE_SITE_SETTING_HERO_CARD_CONFIGURATION, {
    refetchQueries: [{
      query: SITE_SETTING_DETAIL_QUERY,
      variables: { slug: siteSettingSlug }
    }],
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { updateSiteSettingHeroCardConfiguration: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        setMutating(false)
        showSuccessMessage(format('ui.siteSetting.heroCard.submitted'))
        setHeroCardConfigurations([...response.siteSetting.heroCardConfigurations])
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
      name: heroCardConfiguration?.name,
      title: heroCardConfiguration?.title,
      external: heroCardConfiguration?.external,
      description: heroCardConfiguration?.description,
      destinationUrl: heroCardConfiguration?.destinationUrl,
      imageUrl: heroCardConfiguration?.imageUrl
    }
  })

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const { name, title, description, external, destinationUrl, imageUrl } = value
      const currentHeroCardConfiguration = {
        ...heroCardConfiguration,
        name: name ?? heroCardConfiguration?.name,
        title: title ?? heroCardConfiguration?.title,
        external: external ?? heroCardConfiguration?.external,
        description: description ?? heroCardConfiguration?.description,
        destinationUrl: destinationUrl ?? heroCardConfiguration?.destinationUrl,
        imageUrl: imageUrl ?? heroCardConfiguration?.imageUrl,
        saved: false
      }

      const currentHeroCardConfigurations = [...heroCardConfigurations]
      // Try to find the index in the top level heroCard configurations
      let indexOfHeroCardConfiguration = heroCardConfigurations.findIndex(m => m.id === heroCardConfiguration.id)
      if (indexOfHeroCardConfiguration >= 0) {
        // Update at that index using the current heroCard configuration.
        currentHeroCardConfigurations[indexOfHeroCardConfiguration] = currentHeroCardConfiguration
      }

      setHeroCardConfigurations(currentHeroCardConfigurations)
    })

    return () => unsubscribe()
  }, [watch, heroCardConfiguration, heroCardConfigurations, setHeroCardConfigurations])

  // Watch the current external value to toggle between url input and standard text input.
  const currentExternalValue = watch('external')

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, title, description, external, destinationUrl, imageUrl } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        siteSettingSlug,
        id: heroCardConfiguration?.id,
        type: heroCardConfiguration?.type,
        name: name ?? heroCardConfiguration?.name,
        title: title ?? heroCardConfiguration?.title,
        imageUrl: imageUrl ?? heroCardConfiguration?.imageUrl,
        external: external ?? heroCardConfiguration?.external,
        description: description ?? heroCardConfiguration?.description,
        destinationUrl: destinationUrl ?? heroCardConfiguration?.destinationUrl
      }

      updateExchangeHeroCard({
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

  return loadingUserSession
    ? <Loading />
    : <form onSubmit={handleSubmit(doUpsert)} className='border-b border-solid'>
      <div className='px-8 py-6'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {heroCardConfiguration && format('app.editEntity', { entity: heroCardConfiguration.name })}
            {!heroCardConfiguration && `${format('app.createNew')} ${format('ui.siteSetting.heroCard.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.siteSetting.heroCard.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              disabled={
                heroCardConfiguration?.type === 'default.product.heroCard' ||
                heroCardConfiguration?.type === 'default.buildingBlock.heroCard' ||
                heroCardConfiguration?.type === 'default.useCase.heroCard'
              }
              placeholder={format('ui.siteSetting.heroCard.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='title'>
              {format('ui.siteSetting.heroCard.title')}
            </label>
            <Input
              {...register('title', { required: format('validation.required') })}
              id='title'
              placeholder={format('ui.siteSetting.heroCard.title')}
              isInvalid={errors.title}
            />
            {errors.title && <ValidationError value={errors.title?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='description'>
              {format('ui.siteSetting.heroCard.description')}
            </label>
            <Input
              {...register('description', { required: format('validation.required') })}
              id='description'
              placeholder={format('ui.siteSetting.heroCard.description')}
              isInvalid={errors.description}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='imageUrl'>
              {format('ui.siteSetting.heroCard.imageUrl')}
            </label>
            <Input
              {...register('imageUrl', { required: format('validation.required') })}
              id='imageUrl'
              placeholder={format('ui.siteSetting.heroCard.imageUrl')}
              isInvalid={errors.imageUrl}
            />
            {errors.imageUrl && <ValidationError value={errors.imageUrl?.message} />}
          </div>
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register('external')} />
            {format('ui.siteSetting.heroCard.external')}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='destinationUrl'>
              {format('ui.siteSetting.heroCard.destinationUrl')}
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
                    isInvalid={errors.destinationUrl}
                    placeholder={format('ui.siteSetting.heroCard.destinationUrl')}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              : <Input
                {...register('destinationUrl', { required: format('validation.required') })}
                id='destinationUrl'
                placeholder={format('ui.siteSetting.heroCard.destinationUrl')}
                isInvalid={errors.destinationUrl}
              />
            }
            {errors.destinationUrl && <ValidationError value={errors.destinationUrl?.message} />}
          </div>
          <div className='flex flex-wrap text-sm gap-3'>
            <button type='submit' className='submit-button' disabled={mutating}>
              {format('ui.siteSetting.heroCard.save')}
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        </div>
      </div>
    </form>
}

export default HeroCardConfigurationEditor

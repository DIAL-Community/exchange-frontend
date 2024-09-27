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
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { UPDATE_SITE_SETTING_MENU_CONFIGURATION } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'

const MenuConfigurationEditor = (props) => {
  const { menuConfigurations, setMenuConfigurations } = props
  const { siteSettingSlug, menuConfiguration, parentMenuConfiguration } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const { user, loadingUserSession } = useUser()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [updateExchangeMenu, { reset }] = useMutation(UPDATE_SITE_SETTING_MENU_CONFIGURATION, {
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
      const { updateSiteSettingMenuConfiguration: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        setMutating(false)
        showSuccessMessage(format('ui.siteSetting.menu.submitted'))
        setMenuConfigurations([...response.siteSetting.menuConfigurations])
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  const menuTypeOptions = [{
    label: format('ui.siteSetting.menu.type.menuItem'),
    value: 'menu.item'
  },
  {
    label: format('ui.siteSetting.menu.type.separator'),
    value: 'separator'
  }]

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: menuConfiguration?.name,
      type: menuTypeOptions.find(type => menuConfiguration?.type === type.value),
      external: menuConfiguration?.external,
      destinationUrl: menuConfiguration?.destinationUrl
    }
  })

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const { name, type, external, destinationUrl } = value
      const currentMenuConfiguration = {
        ...menuConfiguration,
        name: name ?? menuConfiguration?.name,
        external: external ?? menuConfiguration?.external,
        type: type ? type?.value : menuConfiguration?.type,
        destinationUrl: destinationUrl ?? menuConfiguration?.destinationUrl
      }

      const currentMenuConfigurations = [...menuConfigurations]
      // Try to find the index in the top level menu configurations
      let indexOfMenuConfiguration = menuConfigurations.findIndex(m => m.id === menuConfiguration.id)
      if (indexOfMenuConfiguration >= 0) {
        // Update at that index using the current menu configuration.
        currentMenuConfigurations[indexOfMenuConfiguration] = currentMenuConfiguration
      } else {
        // Try to find the index of the parent in the top level menu configurations
        indexOfMenuConfiguration = menuConfigurations.findIndex(m => {
          return m.menuItemConfigurations.findIndex(mi => mi.id === menuConfiguration.id) >= 0
        })
        const currentParentMenuConfiguration = currentMenuConfigurations[indexOfMenuConfiguration]
        const currentMenuItemConfigurations = [...currentParentMenuConfiguration.menuItemConfigurations]
        const indexOfMenuItemConfiguration = currentMenuItemConfigurations.findIndex(mi => mi.id === menuConfiguration.id)
        // Update at that index using the current menu configuration.
        currentMenuItemConfigurations[indexOfMenuItemConfiguration] = currentMenuConfiguration
        // Rebuild the parent menu configuration with the updated menu item configurations.
        currentMenuConfigurations[indexOfMenuConfiguration] = {
          ...currentParentMenuConfiguration,
          menuItemConfigurations: currentMenuItemConfigurations
        }
      }

      setMenuConfigurations([...currentMenuConfigurations])
    })

    return () => unsubscribe()
  }, [watch, menuConfiguration, menuConfigurations, setMenuConfigurations])

  // Watch the current external value to toggle between url input and standard text input.
  const currentExternalValue = watch('external')
  // Watch the current menu type value to toggle destination url:
  // * Only for menu item. Separator doesn't have destination url.
  // * Menu without child menu. Menu with child menu will have their destination url ignored.
  const currentMenuTypeValue = watch('type') ?? { value: menuConfiguration?.type }

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, external, type, destinationUrl } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        siteSettingSlug,
        id: menuConfiguration?.id,
        name: name ?? menuConfiguration?.name,
        parentId: parentMenuConfiguration?.id ?? 'n/a',
        external: external ?? menuConfiguration?.external,
        type: type ? type?.value : menuConfiguration?.type,
        destinationUrl: destinationUrl ?? menuConfiguration?.destinationUrl
      }

      updateExchangeMenu({
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
    : <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-8 py-6'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {menuConfiguration && format('app.editEntity', { entity: menuConfiguration.name })}
            {!menuConfiguration && `${format('app.createNew')} ${format('ui.siteSetting.menu.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.siteSetting.menu.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              disabled={
                currentMenuTypeValue?.value !== 'menu' &&
                currentMenuTypeValue?.value !== 'menu.item' &&
                currentMenuTypeValue?.value !== 'separator'
              }
              placeholder={format('ui.siteSetting.menu.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          {(currentMenuTypeValue?.value === 'menu.item' || currentMenuTypeValue?.value === 'separator') &&
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='type' className='required-field'>
                {format('ui.siteSetting.menu.type')}
              </label>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id='type'
                    name='type'
                    isSearch
                    isBorderless
                    options={menuTypeOptions}
                    placeholder={format('ui.siteSetting.menu.type')}
                    isInvalid={errors.type}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.type && <ValidationError value={errors.type?.message} />}
            </div>
          }
          {currentMenuTypeValue?.value === 'menu.item' &&
            <div className='flex flex-col gap-y-2'>
              <label className='flex gap-x-2 mb-2 items-center self-start'>
                <Checkbox {...register('external')} />
                {format('ui.siteSetting.menu.external')}
              </label>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='destinationUrl'>
                  {format('ui.siteSetting.menu.destinationUrl')}
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
                        placeholder={format('ui.siteSetting.menu.destinationUrl')}
                      />
                    )}
                    rules={{ required: format('validation.required') }}
                  />
                  : <Input
                    {...register('destinationUrl', { required: format('validation.required') })}
                    id='destinationUrl'
                    placeholder={format('ui.siteSetting.menu.destinationUrl')}
                    isInvalid={errors.destinationUrl}
                  />
                }
                {errors.destinationUrl && <ValidationError value={errors.destinationUrl?.message} />}
              </div>
            </div>
          }
          {currentMenuTypeValue?.value === 'menu' && menuConfiguration.menuItemConfigurations.length <= 0 &&
            <div className='flex flex-col gap-y-2'>
              <label className='flex gap-x-2 mb-2 items-center self-start'>
                <Checkbox {...register('external')} />
                {format('ui.siteSetting.menu.external')}
              </label>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='destinationUrl'>
                  {format('ui.siteSetting.menu.destinationUrl')}
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
                        placeholder={format('ui.siteSetting.menu.destinationUrl')}
                      />
                    )}
                    rules={{ required: format('validation.required') }}
                  />
                  : <Input
                    {...register('destinationUrl', { required: format('validation.required') })}
                    id='destinationUrl'
                    placeholder={format('ui.siteSetting.menu.destinationUrl')}
                    isInvalid={errors.destinationUrl}
                  />
                }
                {errors.destinationUrl && <ValidationError value={errors.destinationUrl?.message} />}
              </div>
            </div>
          }
          <div className='flex flex-wrap text-sm gap-3'>
            <button type='submit' className='submit-button' disabled={mutating}>
              {format('ui.siteSetting.menu.save')}
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        </div>
      </div>
    </form>
}

export default MenuConfigurationEditor

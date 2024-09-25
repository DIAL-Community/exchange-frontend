import { useCallback, useContext, useState } from 'react'
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
import { UPDATE_SITE_SETTING_MENU_CONFIGURATION } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'

const MenuConfigurationEditor = ({ siteSettingSlug, menuConfiguration, parentMenuConfiguration, setMenuConfigurations }) => {
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
        showFailureMessage(response.errors)
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
      name: menuConfiguration?.name,
      external: menuConfiguration?.external,
      destinationUrl: menuConfiguration?.destinationUrl
    }
  })

  const isExternalTarget = watch('external')

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, external, destinationUrl } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        siteSettingSlug,
        name,
        external,
        destinationUrl,
        id: menuConfiguration?.id,
        slug: menuConfiguration?.slug,
        type: menuConfiguration?.type,
        parentSlug: parentMenuConfiguration?.slug ?? 'n/a'
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
              placeholder={format('ui.siteSetting.menu.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='destinationUrl'>
              {format('ui.siteSetting.menu.destinationUrl')}
            </label>
            <div>{isExternalTarget}</div>
            {isExternalTarget
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
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register('external')} />
            {format('ui.siteSetting.menu.external')}
          </label>
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

import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import * as FetchStatus from '../../shared/FetchStatus'
import Checkbox from '../../shared/form/Checkbox'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_SITE_SETTING } from '../../shared/mutation/siteSetting'
import { PAGINATED_SITE_SETTINGS_QUERY, SITE_SETTING_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/siteSetting'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const SiteSettingForm = React.memo(({ siteSetting }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = siteSetting?.slug ?? ''

  const { user, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateSiteSetting, { reset }] = useMutation(CREATE_SITE_SETTING, {
    refetchQueries: [{
      query: SITE_SETTING_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_SITE_SETTINGS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createSiteSetting.siteSetting && data.createSiteSetting.errors.length === 0) {
        const redirectPath = `/admin/site-settings/${data.createSiteSetting.siteSetting.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.siteSetting.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.siteSetting.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.siteSetting.label') }))
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: siteSetting?.name,
      slug: siteSetting?.slug,
      description: siteSetting?.description,
      defaultSetting: siteSetting?.defaultSetting,
      enableMarketplace: siteSetting?.enableMarketplace,
      faviconUrl: siteSetting?.faviconUrl,
      exchangeLogoUrl: siteSetting?.exchangeLogoUrl,
      openGraphLogoUrl: siteSetting?.openGraphLogoUrl
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
      const {
        name,
        description,
        defaultSetting,
        enableMarketplace,
        faviconUrl,
        exchangeLogoUrl,
        openGraphLogoUrl
      } = data
      const variables = {
        name,
        slug,
        description,
        defaultSetting,
        enableMarketplace,
        faviconUrl: faviconUrl ?? '/favicon.ico',
        exchangeLogoUrl: exchangeLogoUrl ?? '/ui/v1/hero-dx-bg.svg',
        openGraphLogoUrl: openGraphLogoUrl ?? '/ui/v1/hero-dx-bg.svg'
      }

      updateSiteSetting({
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
    router.push(`/admin/site-settings/${slug}`)
  }

  return loadingUserSession
    ? <FetchStatus.Loading />
    : user.isAdminUser || user.isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {siteSetting
                  ? format('app.editEntity', { entity: siteSetting.name })
                  : `${format('app.createNew')} ${format('ui.siteSetting.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('ui.siteSetting.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.siteSetting.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <label className='flex gap-x-2 items-center' htmlFor='enableMarketplace'>
                <Checkbox {...register('enableMarketplace')} id='enableMarketplace' />
                {format('ui.siteSetting.enableMarketplace')}
              </label>
              <label className='flex gap-x-2 items-center' htmlFor='defaultSetting'>
                <Checkbox {...register('defaultSetting')} id='defaultSetting' />
                {format('ui.siteSetting.defaultSetting')}
              </label>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='description'>
                  {format('ui.siteSetting.description')}
                </label>
                <Controller
                  id='description'
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='description-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('ui.siteSetting.description')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.siteSetting.label')}`}
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
      : <FetchStatus.Unauthorized />
})

SiteSettingForm.displayName = 'SiteSettingForm'

export default SiteSettingForm

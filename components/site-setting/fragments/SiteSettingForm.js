import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_SITE_SETTING } from '../../shared/mutation/siteSetting'
import { PAGINATED_SITE_SETTINGS_QUERY, SITE_SETTING_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/siteSetting'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const SiteSettingForm = React.memo(({ siteSetting }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = siteSetting?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateSiteSetting, { reset }] = useMutation(CREATE_SITE_SETTING, {
    refetchQueries: [{
      query: SITE_SETTING_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_SITE_SETTINGS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
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
      primary: siteSetting?.siteColors?.primary,
      secondary: siteSetting?.siteColors?.secondary,
      tertiary: siteSetting?.siteColors?.tertiary
    }
  })

  const doUpsert = async (data) => {
    const {
      name,
      description,
      defaultSetting,
      enableMarketplace,
      faviconUrl,
      exchangeLogoUrl,
      primary,
      secondary,
      tertiary
    } = data
    const variables = {
      name,
      slug,
      description,
      defaultSetting,
      enableMarketplace,
      faviconUrl: faviconUrl ?? '/favicon.ico',
      exchangeLogoUrl: exchangeLogoUrl ?? '/ui/v1/hero-dx-bg.svg',
      openGraphLogoUrl: exchangeLogoUrl ?? '/ui/v1/hero-dx-bg.svg',
      siteColors: { primary, secondary, tertiary }
    }

    updateSiteSetting({
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
    router.push(`/admin/site-settings/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6'>
        <div className='flex flex-col gap-y-6 text-sm text-dial-meadow'>
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
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='favicon-url'>
              {format('ui.siteSetting.faviconUrl')}
            </label>
            <Controller
              name='faviconUrl'
              control={control}
              rules={{ required: format('validation.required') }}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='favicon-url'
                  value={value}
                  onChange={onChange}
                  placeholder={format('ui.siteSetting.faviconUrl.placeholder')}
                />
              )}
            />
            {errors.faviconUrl && <ValidationError value={errors.faviconUrl?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='exchange-logo-url'>
              {format('ui.siteSetting.exchangeLogoUrl')}
            </label>
            <Controller
              name='exchangeLogoUrl'
              control={control}
              rules={{ required: format('validation.required') }}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='exchange-logo-url'
                  value={value}
                  onChange={onChange}
                  placeholder={format('ui.siteSetting.exchangeLogoUrl.placeholder')}
                />
              )}
            />
            {errors.exchangeLogoUrl && <ValidationError value={errors.exchangeLogoUrl?.message} />}
          </div>
          <label className='flex gap-x-2 items-center' htmlFor='enableMarketplace'>
            <Checkbox {...register('enableMarketplace')} id='enableMarketplace' />
            {format('ui.siteSetting.enableMarketplace')}
          </label>
          <label className='flex gap-x-2 items-center' htmlFor='defaultSetting'>
            <Checkbox {...register('defaultSetting')} id='defaultSetting' />
            {format('ui.siteSetting.defaultSetting')}
          </label>
          <div className='flex flex-col gap-y-2 text-lg'>
            {format('ui.siteSetting.siteColors')}
          </div>
          <div className='flex w-full pb-4'>
            <div className='w-full flex'>
              <div className='flex items-center pr-2'>
                {format('ui.siteSetting.siteColors.primary')}:
              </div>
              <Input
                {...register('primary')}
                id='primary'
                placeholder={format('ui.siteSetting.siteColors.primary')}
              />
              <div className='flex items-center pr-2 pl-4'>
                {format('ui.siteSetting.siteColors.secondary')}:
              </div>
              <Input
                {...register('secondary')}
                id='secondary'
                placeholder={format('ui.siteSetting.siteColors.secondary')}
              />
              <div className='flex items-center pr-2 pl-4'>
                {format('ui.siteSetting.siteColors.tertiary')}:
              </div>
              <Input
                {...register('tertiary')}
                id='tertiary'
                placeholder={format('ui.siteSetting.siteColors.tertiary')}
              />
            </div>
          </div>
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
})

SiteSettingForm.displayName = 'SiteSettingForm'

export default SiteSettingForm

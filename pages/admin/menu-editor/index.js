import { useCallback, useContext, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FaSpinner } from 'react-icons/fa6'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedMessage, useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useMutation } from '@apollo/client'
import { SiteSettingContext } from '../../../components/context/SiteSettingContext'
import { Loading } from '../../../components/shared/FetchStatus'
import Footer from '../../../components/shared/Footer'
import Checkbox from '../../../components/shared/form/Checkbox'
import Input from '../../../components/shared/form/Input'
import UrlInput from '../../../components/shared/form/UrlInput'
import ValidationError from '../../../components/shared/form/ValidationError'
import Header from '../../../components/shared/Header'
import { UPDATE_SITE_SETTING_MENU_CONFIGURATION } from '../../../components/shared/mutation/siteSetting'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'

const MenuEditorPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('ui.setting.menu.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.setting.menu.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <MenuConfigurationsEditor />
        <Footer />
      </ClientOnly>
    </>
  )
}

const MenuConfigurationsEditor = () => {
  const { menuConfigurations } = useContext(SiteSettingContext)

  return (
    <div className='lg:px-8 xl:px-56 py-4 min-h-[75vh]'>
      <div className='flex flex-col gap-1'>
        {
          menuConfigurations.map((menuConfiguration) => {
            return (
              <div
                key={menuConfiguration.slug}
                data-menu={menuConfiguration.slug}
                className='flex flex-col gap-1'
              >
                <MenuConfigurationEditor menuConfiguration={menuConfiguration} />
                <div className='ml-8 flex flex-col gap-1'>
                  {menuConfiguration.menuItems.map(menuItem => {
                    return (
                      <MenuConfigurationEditor key={menuItem.slug} menuConfiguration={menuItem} />
                    )
                  })}
                </div>
              </div>
            )
          })
        }</div>
    </div>
  )
}

const MenuConfigurationEditorForm = ({ menuConfiguration }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const { user, loadingUserSession } = useUser()

  const { menuConfigurations } = useContext(SiteSettingContext)
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [updateExchangeMenu, { reset }] = useMutation(UPDATE_SITE_SETTING_MENU_CONFIGURATION, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { createPlaybook: response } = data
      if (response.errors.length === 0 && response.playbook) {
        setMutating(false)
        showSuccessMessage(format('ui.setting.menu.submitted'))
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
      type: menuConfiguration?.type,
      external: menuConfiguration?.external,
      targetUrl: menuConfiguration?.targetUrl
    }
  })

  const isExternalTarget = watch('external')

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      console.log('Received data: ', data)
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        slug: menuConfiguration?.slug,
        menuConfigurations
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
            {!menuConfiguration && `${format('app.createNew')} ${format('ui.setting.menu.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.setting.menu.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('ui.setting.menu.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          {menuConfiguration.type === 'menu-item' &&
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='targetUrl'>
                {format('ui.setting.menu.targetUrl')}
              </label>
              <div>{isExternalTarget}</div>
              {isExternalTarget
                ? <Controller
                  name='targetUrl'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <UrlInput
                      value={value}
                      onChange={onChange}
                      id='targetUrl'
                      isInvalid={errors.targetUrl}
                      placeholder={format('ui.setting.menu.targetUrl')}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                : <Input
                  {...register('targetUrl', { required: format('validation.required') })}
                  id='targetUrl'
                  placeholder={format('ui.setting.menu.targetUrl')}
                  isInvalid={errors.targetUrl}
                />
              }
              {errors.targetUrl && <ValidationError value={errors.targetUrl?.message} />}
            </div>
          }
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register('external')} />
            {format('ui.setting.menu.external')}
          </label>
          <div className='flex flex-wrap text-sm gap-3'>
            <button type='submit' className='submit-button' disabled={mutating}>
              {format('ui.setting.menu.save')}
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        </div>
      </div>
    </form>
}

const MenuConfigurationEditor = ({ menuConfiguration }) => {
  const [editing, setEditing] = useState(false)
  const [openingDetail, setOpeningDetail] = useState(false)

  const toggleEditing = () => setEditing(!editing)
  const toggleDetail = () => setOpeningDetail(!openingDetail)

  const { user } = useUser()
  const allowedToEdit = () => user?.isAdminUser || user?.isEditorUser

  return (
    <div className='flex flex-col'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleDetail}>
            <div className='font-semibold px-4 py-4'>
              {menuConfiguration.name}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
              {allowedToEdit() &&
                <button
                  type='button'
                  onClick={toggleEditing}
                  className='cursor-pointer bg-white px-2 py-0.5 rounded'
                >
                  {!editing && <FiEdit3 className='inline pb-0.5 text-dial-stratos ' />}
                  <span className='text-sm px-1 text-dial-stratos'>
                    {!editing && <FormattedMessage id='app.edit' />}
                    {editing && <FormattedMessage id='app.cancel' />}
                  </span>
                </button>
              }
              <button
                type='button'
                onClick={toggleDetail}
                className='cursor-pointer bg-white px-2 py-1.5 rounded'
              >
                {openingDetail
                  ? <BsChevronUp className='cursor-pointer p-01 text-dial-stratos' />
                  : <BsChevronDown className='cursor-pointer p-0.5 text-dial-stratos' />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${openingDetail ? 'slide-down' : 'slide-up'} border`}>
        {editing
          ? <MenuConfigurationEditorForm menuConfiguration={menuConfiguration} toggleEditing={toggleEditing} />
          : <div className='px-4 py-4'>
            Nulla quis tortor non mi auctor hendrerit. Aenean venenatis sit amet enim a fringilla.
            Sed vitae ante felis. Ut dolor dolor, semper at feugiat vel, fringilla mattis metus.
            Nullam eros nulla, egestas a convallis et, volutpat quis est. Suspendisse eleifend
            pulvinar sagittis. Morbi leo enim, ultrices vel odio at, tincidunt congue leo.
            Vestibulum sit amet metus convallis, efficitur est at, suscipit urna. Aenean ultricies
            nisl in malesuada venenatis. Fusce efficitur dictum turpis eget dapibus.
          </div>
        }
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default MenuEditorPage

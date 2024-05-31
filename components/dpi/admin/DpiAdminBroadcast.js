import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import GeocodeAutocomplete from '../../shared/form/GeocodeAutocomplete'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_MESSAGE } from '../../shared/mutation/message'
import DpiAdminTabs from './DpiAdminTabs'

const BroadcastForm = ({ message }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [currentMessageType, setCurrentMessageType] = useState('announcement')

  const { user, loadingUserSession } = useUser()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [createMessage, { reset }] = useMutation(CREATE_MESSAGE, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { createMessage: response } = data
      if (response.errors.length === 0 && response.message) {
        setMutating(false)
        showSuccessMessage(format('dpi.curriculum.submitted'))
      } else {
        showFailureMessage(response.errors)
        setMutating(false)
        reset()
      }
    }
  })

  const messageTypeOptions = useMemo(() => {
    return [
      { label: format('dpi.broadcast.messageType.announcement'), value: 'announcement' },
      { label: format('dpi.broadcast.messageType.email'), value: 'email' },
      { label: format('dpi.broadcast.messageType.event'), value: 'event' }
    ]
  }, [format])
  const [ defaultMessageType ] = messageTypeOptions

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: message?.name,
      messageType: messageTypeOptions.find(({ value }) => value === message?.messageType) ?? defaultMessageType,
      messageTemplate: message?.messageTemplate,
      messageDateTime: new Date()
    }
  })

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'messageType') {
        setCurrentMessageType(value[name].value)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, messageType, messageTemplate, messageDatetime, visible } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        messageType: messageType.value,
        messageTemplate,
        messageDatetime: messageDatetime ?? new Date().toISOString(),
        visible
      }

      createMessage({
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
    // Maybe clear the form?
  }

  const handleEventLocation = (eventLocation) => {
    console.log('Event location: ', eventLocation)
  }

  return loadingUserSession
    ? <Loading />
    : user?.isAdminUser || user?.isAdliAdminUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 text-dial-slate-100'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {`${format('app.createNew')} ${format('dpi.broadcast.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('dpi.broadcast.title')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('dpi.broadcast.title')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field'>
                  {format('dpi.broadcast.messageTemplate.label')}
                </label>
                <Controller
                  name='messageTemplate'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='message-template-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('dpi.broadcast.messageTemplate.placeholder')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.messageTemplate && <ValidationError value={errors.messageTemplate?.message} />}
              </div>
              <div className='form-field-wrapper'>
                <label className='required-field'>
                  {format('dpi.broadcast.messageType')}
                </label>
                <Controller
                  name='messageType'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isSearch
                      isBorderless
                      options={messageTypeOptions}
                      placeholder={format('dpi.broadcast.messageType')}
                      isInvalid={errors.messageType}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.messageType && <ValidationError value={errors.messageType?.message} />}
              </div>
              {currentMessageType === 'announcement' &&
                <div className='flex flex-col gap-y-2'>
                  <label className='required-field'>
                    {format('dpi.broadcast.announcementDatetime')}
                  </label>
                  <Input
                    {...register('messageDateTime', { required: format('validation.required') })}
                    type='datetime-local'
                    placeholder={format('dpi.broadcast.announcementDatetime')}
                    isInvalid={errors.messageDateTime}
                  />
                  {errors.messageDateTime && <ValidationError value={errors.messageDateTime?.message} />}
                </div>
              }
              {currentMessageType === 'event' &&
                <div className='flex flex-col gap-y-2'>
                  <label className='required-field'>
                    {format('dpi.broadcast.eventDateTime')}
                  </label>
                  <Input
                    {...register('messageDateTime', { required: format('validation.required') })}
                    type='datetime-local'
                    placeholder={format('dpi.broadcast.eventDateTime')}
                    isInvalid={errors.messageDateTime}
                  />
                  {errors.messageDateTime && <ValidationError value={errors.messageDateTime?.message} />}
                </div>
              }
              {currentMessageType === 'event' &&
                <label className='flex flex-col gap-y-2 mb-2'>
                  {format('dpi.broadcast.eventLocation')}
                  <GeocodeAutocomplete
                    value={null}
                    onChange={handleEventLocation}
                  />
                </label>
              }
              <div className='flex flex-wrap text-sm gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {format('dpi.curriculum.save')}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3 inline' />}
                </button>
              </div>
            </div>
          </div>
        </form>
      )
      : <Unauthorized />
}

const DpiAdminBroadcast = () => {
  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          <BroadcastForm />
        </div>
      </div>
    </div>
  )
}

export default DpiAdminBroadcast

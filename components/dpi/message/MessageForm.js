import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import Checkbox from '../../shared/form/Checkbox'
import GeocodeAutocomplete from '../../shared/form/GeocodeAutocomplete'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_MESSAGE } from '../../shared/mutation/message'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, DPI_EVENT_MESSAGE_TYPE, generateMessageTypeOptions } from './constant'

const MessageForm = ({ message }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const router = useRouter()

  const messageTypeOptions = generateMessageTypeOptions(format)
  const [defaultMessageType] = messageTypeOptions

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
        showSuccessMessage(
          format('dpi.broadcast.submitted', {
            type: message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
              ? format('dpi.broadcast.messageType.announcement')
              : message.messageType === DPI_EVENT_MESSAGE_TYPE
                ? format('dpi.broadcast.messageType.event')
                : format('dpi.broadcast.messageType.email')
          }),
          () => {
            router.push(`/dpi-admin/broadcasts/${response.message.slug}`)
          }
        )
      } else {
        showFailureMessage(response.errors)
        setMutating(false)
        reset()
      }
    }
  })

  const { handleSubmit, register, control, watch, clearErrors, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: message?.name,
      messageType: messageTypeOptions.find(({ value }) => value === message?.messageType) ?? defaultMessageType,
      messageTemplate: message?.messageTemplate,
      visible: message?.visible ?? true
    }
  })

  const currentMessageType = watch('messageType')

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, messageType: { value: messageTypeValue }, messageTemplate, messageDatetime, visible } = data
      // Send graph query to the backend. Set the base variables needed to perform update.

      console.log('Data received: ', data)
      console.log('Message datetime: ', messageDatetime.toISOString())
      const variables = {
        name,
        messageType: messageTypeValue,
        messageTemplate,
        messageDatetime: messageDatetime.toISOString(),
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
    const slug = message?.slug
    router.push(`/dpi-admin/broadcasts/${slug}`)
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
                {message
                  ? `${format('app.editEntity', { entity: message.name })}`
                  : `${format('app.createNew')} ${currentMessageType.label}`
                }
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('dpi.broadcast.title')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  onClick={() => clearErrors('name')}
                  placeholder={format('dpi.broadcast.title')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field'>
                  {format('dpi.broadcast.messageTemplate')}
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
                      initInstanceCallback={(editor) => {
                        editor.on('click', () => {
                          clearErrors('messageTemplate')
                        })
                      }}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.messageTemplate && <ValidationError value={errors.messageTemplate?.message} />}
              </div>
              <div className='flex gap-4'>
                <div className='lg:basis-1/2 form-field-wrapper'>
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
                {currentMessageType.value === DPI_ANNOUNCEMENT_MESSAGE_TYPE &&
                  <div className='lg:basis-1/2 flex flex-col gap-2'>
                    <label className='required-field'>
                      {format('dpi.broadcast.announcementDatetime')}
                    </label>
                    <Controller
                      name='messageDatetime'
                      control={control}
                      defaultValue={message?.messageDatetime ? new Date(message.messageDatetime) : new Date()}
                      rules={{ required: format('validation.required') }}
                      render={({ field: { onChange, value, ref, name } }) => {
                        return (
                          <DatePicker
                            ref={(elem) => {
                              elem && ref(elem.input)
                            }}
                            name={name}
                            className='h-[38px] w-full'
                            placeholderText={format('dpi.broadcast.announcementDatetime')}
                            onChange={(date) => {
                              onChange(date)
                              console.log('Date data received: ', date.toISOString())
                            }}
                            onFocus={() => clearErrors(['messageDatetime'])}
                            selected={value}
                            isInvalid={errors.messageDatetime}
                            showTimeSelect
                            timeFormat="p"
                            timeIntervals={15}
                            dateFormat="Pp"
                            showPopperArrow={false}
                          />
                        )
                      }}
                    />
                    {errors.messageDatetime && <ValidationError value={errors.messageDatetime?.message} />}
                  </div>
                }
                {currentMessageType.value === DPI_EVENT_MESSAGE_TYPE &&
                  <div className='lg:basis-1/2 flex flex-col gap-y-2'>
                    <label className='required-field'>
                      {format('dpi.broadcast.eventDatetime')}
                    </label>
                    <Controller
                      name='messageDatetime'
                      control={control}
                      defaultValue={message?.messageDatetime ? new Date(message.messageDatetime) : new Date()}
                      rules={{ required: format('validation.required') }}
                      render={({ field: { onChange, value, ref, name } }) => {
                        return (
                          <DatePicker
                            ref={(elem) => {
                              elem && ref(elem.input)
                            }}
                            name={name}
                            className='h-[38px] w-full'
                            placeholderText={format('dpi.broadcast.eventDatetime')}
                            onChange={(date) => {
                              onChange(date)
                              console.log('Date data received: ', date.toISOString())
                            }}
                            onFocus={() => clearErrors(['messageDatetime'])}
                            selected={value}
                            isInvalid={errors.messageDatetime}
                            showTimeSelect
                            timeFormat="p"
                            timeIntervals={15}
                            dateFormat="Pp"
                            showPopperArrow={false}
                          />
                        )
                      }}
                    />
                    {errors.messageDatetime && <ValidationError value={errors.messageDatetime?.message} />}
                  </div>
                }
              </div>
              {currentMessageType.value === DPI_EVENT_MESSAGE_TYPE &&
                <label className='flex flex-col gap-y-2 mb-2'>
                  {format('dpi.broadcast.eventLocation')}
                  <GeocodeAutocomplete
                    value={null}
                    onChange={handleEventLocation}
                  />
                </label>
              }
              {[DPI_ANNOUNCEMENT_MESSAGE_TYPE, DPI_EVENT_MESSAGE_TYPE].indexOf(currentMessageType.value) >= 0 &&
                <label className='flex gap-x-2 items-center self-start'>
                  <Checkbox {...register('visible')} />
                  {format('dpi.broadcast.visible', {
                    message_type: currentMessageType.value === DPI_ANNOUNCEMENT_MESSAGE_TYPE
                      ? format('dpi.broadcast.messageType.announcement')
                      : format('dpi.broadcast.messageType.event')
                  })}
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

export default MessageForm

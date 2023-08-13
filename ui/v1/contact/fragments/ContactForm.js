import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_CONTACT } from '../../shared/mutation/contact'
import { REBRAND_BASE_PATH } from '../../utils/constants'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Select from '../../shared/form/Select'
import { generateContactTypeOptions } from '../../shared/form/options'

const ContactForm = React.memo(({ contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = contact?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateContact, { reset }] = useMutation(CREATE_CONTACT, {
    onCompleted: (data) => {
      if (data.createContact.contact && data.createContact.errors.length === 0) {
        const redirectPath = `/${router.locale}/contacts/${data.createContact.contact.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showToast(
          format('contact.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          redirectHandler
        )
      } else {
        setMutating(false)
        showToast(format('contact.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('contact.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const contactTypeOptions = useMemo(() => generateContactTypeOptions(format), [format])

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: contact?.name,
      aliases: contact?.aliases?.length ? contact?.aliases.map(value => ({ value })) : [{ value: '' }],
      contactType: contactTypeOptions.find(({ value }) => value === contact?.contactType) ?? contactTypeOptions[0],
      website: contact?.website,
      visualizationUrl: contact?.visualizationUrl,
      geographicCoverage: contact?.geographicCoverage,
      timeRange: contact?.timeRange,
      license: contact?.license,
      languages: contact?.languages,
      dataFormat: contact?.dataFormat,
      description: contact?.contactDescription?.description
    }
  })

  const {
    fields: aliases,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])
  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        aliases,
        website,
        visualizationUrl,
        geographicCoverage,
        timeRange,
        contactType,
        license,
        languages,
        dataFormat,
        description,
        imageFile
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        visualizationUrl,
        geographicCoverage,
        timeRange,
        contactType: contactType.value,
        license,
        languages,
        dataFormat,
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateContact({
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
    router.push(`${REBRAND_BASE_PATH}/contacts/${slug}`)
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {contact
              ? format('app.editEntity', { entity: contact.name })
              : `${format('app.createNew')} ${format('contact.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('contact.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('contact.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('contact.aliases')}</label>
            {aliases.map((alias, aliasIdx) => (
              <div key={alias.id} className='flex gap-x-2'>
                <Input
                  {...register(`aliases.${aliasIdx}.value`)}
                  placeholder={format('contact.alias')}
                />
                {isLastAlias(aliasIdx) && (
                  <span>
                    <IconButton icon={<FaPlus />} onClick={() => append({ value: '' })} />
                  </span>
                )}
                {!isSingleAlias && (
                  <span>
                    <IconButton icon={<FaMinus />} onClick={() => remove(aliasIdx)} />
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='website'>
              {format('contact.website')}
            </label>
            <Controller
              name='website'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  value={value}
                  onChange={onChange}
                  id='website'
                  isInvalid={errors.website}
                  placeholder={format('contact.website')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.website && <ValidationError value={errors.website?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='visualizationUrl'>
              {format('contact.visualizationUrl')}
            </label>
            <Controller
              name='visualizationUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  value={value}
                  onChange={onChange}
                  id='visualizationUrl'
                  placeholder={format('contact.visualizationUrl')}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>
              {format('contact.contactType')}
            </label>
            <Controller
              name='contactType'
              control={control}
              render={({ field }) =>
                <Select {...field}
                  options={contactTypeOptions}
                  placeholder={format('contact.contactType')}
                />
              }
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>
              {format('contact.imageFile')}
            </label>
            <FileUploader {...register('imageFile')} />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='geographicCoverage'>
              {format('contact.coverage')}
            </label>
            <Input
              {...register('geographicCoverage')}
              id='geographicCoverage'
              placeholder={format('contact.coverage')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='timeRange'>
              {format('contact.timeRange')}
            </label>
            <Input
              {...register('timeRange')}
              id='timeRange'
              placeholder={format('contact.timeRange')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='license'>
              {format('contact.license')}
            </label>
            <Input
              {...register('license')}
              id='license'
              placeholder={format('contact.license')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='languages'>
              {format('contact.languages')}
            </label>
            <Input
              {...register('languages')}
              id='languages'
              placeholder={format('contact.languages')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='dataFormat'>
              {format('contact.dataFormat')}
            </label>
            <Input
              {...register('dataFormat')}
              id='dataFormat'
              placeholder={format('contact.dataFormat')}
            />
          </div>
          <div className='block flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field'>
              {format('contact.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('contact.description')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('contact.label')}`}
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
  ) : (
    <Unauthorized />
  )
})

ContactForm.displayName = 'ContactForm'

export default ContactForm

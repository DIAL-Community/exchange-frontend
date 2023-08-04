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
import { CREATE_TAG } from '../../shared/mutation/tag'
import { REBRAND_BASE_PATH } from '../../utils/constants'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Checkbox from '../../shared/form/Checkbox'
import Select from '../../shared/form/Select'

const TagForm = React.memo(({ tag }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = tag?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateTag, { reset }] = useMutation(CREATE_TAG, {
    onCompleted: (data) => {
      if (data.createTag.tag && data.createTag.errors.length === 0) {
        const redirectPath = `/${router.locale}/tags/${data.createTag.tag.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showToast(
          format('tag.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          redirectHandler
        )
      } else {
        setMutating(false)
        showToast(format('tag.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('tag.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const endorserLevelOptions = [
    { label: format('tag.endorserLevel.none'), value: 'none' },
    { label: format('tag.endorserLevel.bronze'), value: 'bronze' },
    { label: format('tag.endorserLevel.silver'), value: 'silver' },
    { label: format('tag.endorserLevel.gold'), value: 'gold' }
  ]

  const [defaultEndorserLevel] = endorserLevelOptions

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: tag?.name,
      aliases: tag?.aliases?.length
        ? tag?.aliases.map(value => ({ value }))
        : [{ value: '' }],
      website: tag?.website ?? '',
      isEndorser: tag?.isEndorser,
      whenEndorsed: tag?.whenEndorsed ?? null,
      endorserLevel:
        endorserLevelOptions.find(
          ({ value }) => value === tag?.endorserLevel
        ) ?? defaultEndorserLevel,
      isMni: tag?.isMni,
      description: tag?.tagDescription?.description,
      hasStorefront: tag?.hasStorefront,
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
        imageFile,
        website,
        isEndorser,
        whenEndorsed,
        endorserLevel,
        isMni,
        description,
        aliases,
        hasStorefront
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        isEndorser,
        whenEndorsed: whenEndorsed || null,
        endorserLevel: endorserLevel.value,
        isMni,
        description,
        hasStorefront
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateTag({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            'Authorization': `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`${REBRAND_BASE_PATH}/tags/${slug}`)
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {tag
              ? format('app.editEntity', { entity: tag.name })
              : `${format('app.createNew')} ${format('tag.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('tag.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('tag.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('tag.aliases')}</label>
            {aliases.map((alias, aliasIdx) => (
              <div key={alias.id} className='flex gap-x-2'>
                <Input
                  {...register(`aliases.${aliasIdx}.value`)}
                  placeholder={format('tag.alias')}
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
              {format('tag.website')}
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
                  placeholder={format('tag.website')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.website && <ValidationError value={errors.website?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('tag.imageFile')}</label>
            <FileUploader {...register('imageFile')} />
          </div>
          <label className='flex gap-x-2 items-center self-start text-dial-sapphire'>
            <Checkbox {...register('isEndorser')} />
            {format('tag.isEndorser')}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('tag.whenEndorsed')}</label>
            <Input
              {...register('whenEndorsed')}
              type='date'
              placeholder={format('tag.whenEndorsed')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('tag.endorserLevel')}</label>
            <Controller
              name='endorserLevel'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={endorserLevelOptions}
                  placeholder={format('tag.endorserLevel')}
                />
              )}
            />
          </div>
          <label className='flex gap-x-2 items-center self-start text-dial-sapphire'>
            <Checkbox {...register('isMni')} />
            {format('tag.isMni')}
          </label>
          <label className='flex gap-x-2 items-center self-start text-dial-sapphire'>
            <Checkbox {...register('hasStorefront')} />
            {format('tag.hasStorefront')}
          </label>
          <div className='block flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field'>
              {format('tag.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('tag.description')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('tag.label')}`}
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

TagForm.displayName = 'TagForm'

export default TagForm

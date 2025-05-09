import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { ToastContext } from '../../../../lib/ToastContext'
import Checkbox from '../../../shared/form/Checkbox'
import FileUploader from '../../../shared/form/FileUploader'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import IconButton from '../../../shared/form/IconButton'
import Input from '../../../shared/form/Input'
import Select from '../../../shared/form/Select'
import UrlInput from '../../../shared/form/UrlInput'
import ValidationError from '../../../shared/form/ValidationError'
import { CREATE_ORGANIZATION } from '../../../shared/mutation/organization'
import { ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_ORGANIZATIONS_QUERY } from '../../../shared/query/organization'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'

const OrganizationForm = memo(({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = organization?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const handleTrimInputOnBlur = (event) => {
    event.target.value = event.target.value.trim()
  }

  const router = useRouter()
  const { locale } = router

  const [updateOrganization, { reset }] = useMutation(CREATE_ORGANIZATION, {
    refetchQueries: [{
      query: ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_ORGANIZATIONS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      if (data.createOrganization.organization && data.createOrganization.errors.length === 0) {
        const redirectPath = `/${locale}/health/organizations/${data.createOrganization.organization.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.organization.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.organization.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.organization.label') }))
      setMutating(false)
      reset()
    }
  })

  const endorserLevelOptions = [
    { label: format('organization.endorserLevel.none'), value: 'none' },
    { label: format('organization.endorserLevel.bronze'), value: 'bronze' },
    { label: format('organization.endorserLevel.silver'), value: 'silver' },
    { label: format('organization.endorserLevel.gold'), value: 'gold' }
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
      name: organization?.name,
      aliases: organization?.aliases?.length
        ? organization?.aliases.map(value => ({ value }))
        : [{ value: '' }],
      website: organization?.website ?? '',
      isEndorser: organization?.isEndorser,
      whenEndorsed: organization?.whenEndorsed ?? null,
      endorserLevel:
        endorserLevelOptions.find(
          ({ value }) => value === organization?.endorserLevel
        ) ?? defaultEndorserLevel,
      isMni: organization?.isMni,
      description: organization?.organizationDescription?.description,
      hasStorefront: organization?.hasStorefront
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
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
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

    updateOrganization({
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
    router.push(`/${locale}/health/organizations/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {organization
              ? format('app.editEntity', { entity: organization.name })
              : `${format('app.createNew')} ${format('ui.organization.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-meadow required-field' htmlFor='name'>
              {format('organization.name')}
            </label>
            <Input
              {...register(
                'name',
                {
                  required: format('validation.required'),
                  maxLength: { value: 80, message: format('validation.max-length.text', { maxLength: 80 }) }
                })}
              id='name'
              placeholder={format('organization.name')}
              isInvalid={errors.name}
              onBlur={handleTrimInputOnBlur}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-meadow'>{format('organization.aliases')}</label>
            {aliases.map((alias, aliasIdx) => (
              <div key={alias.id} className='flex gap-x-2'>
                <Input
                  {...register(`aliases.${aliasIdx}.value`)}
                  placeholder={format('organization.alias')}
                />
                {isLastAlias(aliasIdx) && (
                  <IconButton
                    className='bg-dial-meadow'
                    icon={<FaPlus className='text-sm' />}
                    onClick={() => append({ value: '' })}
                  />
                )}
                {!isSingleAlias && (
                  <IconButton
                    className='bg-dial-meadow '
                    icon={<FaMinus className='text-sm' />}
                    onClick={() => remove(aliasIdx)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-meadow required-field' htmlFor='website'>
              {format('organization.website')}
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
                  placeholder={format('organization.website')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.website && <ValidationError value={errors.website?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-meadow'>{format('organization.imageFile')}</label>
            <FileUploader {...register('imageFile')} />
          </div>
          <label className='flex gap-x-2 items-center self-start text-dial-meadow'>
            <Checkbox {...register('isEndorser')} />
            {format('organization.isEndorser')}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-meadow'>{format('organization.whenEndorsed')}</label>
            <Input
              {...register('whenEndorsed')}
              type='date'
              placeholder={format('organization.whenEndorsed')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-meadow'>{format('organization.endorserLevel')}</label>
            <Controller
              name='endorserLevel'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={endorserLevelOptions}
                  placeholder={format('organization.endorserLevel')}
                />
              )}
            />
          </div>
          <label className='flex gap-x-2 items-center self-start text-dial-meadow'>
            <Checkbox {...register('isMni')} />
            {format('organization.isMni')}
          </label>
          <label className='flex gap-x-2 items-center self-start text-dial-meadow'>
            <Checkbox {...register('hasStorefront')} />
            {format('organization.hasStorefront')}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='text-dial-meadow required-field'>
              {format('organization.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('organization.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.organization.label')}`}
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

OrganizationForm.displayName = 'OrganizationForm'

export default OrganizationForm

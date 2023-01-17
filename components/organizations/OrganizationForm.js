import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner, FaPlus, FaMinus } from 'react-icons/fa'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import FileUploader from '../shared/FileUploader'
import Checkbox from '../shared/Checkbox'
import IconButton from '../shared/IconButton'
import Select from '../shared/Select'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { CREATE_ORGANIZATION } from '../../mutations/organization'
import UrlInput from '../shared/UrlInput'

const OrganizationForm = React.memo(({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { data: session } = useSession()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()
  const [updateOrganization, { data }] = useMutation(CREATE_ORGANIZATION)

  const endorserLevelOptions = [
    { label: format('organization.endorserLevel.none'), value: 'none' },
    { label: format('organization.endorserLevel.bronze'), value: 'bronze' },
    { label: format('organization.endorserLevel.silver'), value: 'silver' },
    { label: format('organization.endorserLevel.gold'), value: 'gold' }
  ]

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: organization?.name,
      aliases: organization?.aliases?.length ? organization?.aliases.map(value => ({ value })) : [{ value: '' }],
      website: organization?.website ?? '',
      isEndorser: organization?.isEndorser,
      whenEndorsed: organization?.whenEndorsed ?? null,
      endorserLevel:
        endorserLevelOptions.find(({ value }) => value === organization?.endorserLevel) ??
        [endorserLevelOptions],
      isMni: organization?.isMni,
      description: organization?.organizationDescription?.description
    }
  })

  const slug = organization?.slug ?? ''

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])

  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (organization) {
      map[organization.slug] = organization.name
    }

    return map
  }, [organization, format])

  useEffect(() => {
    if (!data?.createOrganization?.errors.length && data?.createOrganization?.organization) {
      showToast(
        format('organization.submit.success'),
        'success',
        'top-center',
        1000,
        null,
        () => router.push(`/${router.locale}/organizations/${data.createOrganization.organization.slug}`)
      )
    } else if (data?.createOrganization?.errors.length) {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('organization.submit.failure')}</span>
          {data?.createOrganization?.errors.map((error, errorIdx) => (
            <span key={errorIdx}>{error}</span>
          ))}
        </div>,
        'error',
        'top-center',
        false
      )
    }
  }, [data, format, router, showToast])

  const doUpsert = async (data) => {
    if (session) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = session.user
      const { name, imageFile, website, isEndorser, whenEndorsed, endorserLevel, isMni, description, aliases } = data
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
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateOrganization({
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
    let route = '/organizations'
    if (organization) {
      route = `${route}/${organization.slug}`
    }

    router.push(route)
  }

  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {organization
                  ? format('app.edit-entity', { entity: organization.name })
                  : `${format('app.create-new')} ${format('organization.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='organization-name'>
                    <label className='text-xl text-dial-blue required-field' htmlFor='name'>
                      {format('organization.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('organization.name')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
                      {format('organization.aliases')}
                    </label>
                    {aliases.map((alias, aliasIdx) => (
                      <div key={alias.id} className='flex gap-x-2'>
                        <Input
                          {...register(`aliases.${aliasIdx}.value`)}
                          placeholder={format('organization.alias')}
                          data-testid='alias-name'
                        />
                        {isLastAlias(aliasIdx) && (
                          <span data-testid='alias-add'>
                            <IconButton
                              icon={<FaPlus />}
                              onClick={() => append({ value: '' })}
                            />
                          </span>
                        )}
                        {!isSingleAlias && (
                          <span data-testid='alias-remove'>
                            <IconButton
                              icon={<FaMinus />}
                              onClick={() => remove(aliasIdx)}
                            />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='organization-website'>
                    <label className='text-xl text-dial-blue required-field' htmlFor='website'>
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
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='organization-logo'>
                    <label className='text-xl text-dial-blue'>
                      {format('organization.imageFile')}
                    </label>
                    <FileUploader {...register('imageFile')} />
                  </div>
                  <label
                    className='flex gap-x-2 mb-2 items-center self-start text-xl text-dial-blue'
                    data-testid='organization-is-endorser'
                  >
                    <Checkbox {...register('isEndorser')} />
                    {format('organization.isEndorser')}
                  </label>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
                      {format('organization.whenEndorsed')}
                    </label>
                    <Input
                      {...register('whenEndorsed')}
                      type='date'
                      placeholder={format('organization.whenEndorsed')}
                      data-testid='organization-when-endorsed'
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='organization-endorser-level'>
                    <label className='text-xl text-dial-blue'>
                      {format('organization.endorserLevel')}
                    </label>
                    <Controller
                      name='endorserLevel'
                      control={control}
                      render={
                        ({ field }) =>
                          <Select
                            {...field}
                            options={endorserLevelOptions}
                            placeholder={format('organization.endorserLevel')}
                          />
                      }
                    />
                  </div>
                  <label
                    className='flex gap-x-2 mb-2 items-center self-start text-xl text-dial-blue'
                    data-testid='organization-is-mni'
                  >
                    <Checkbox {...register('isMni')} />
                    {format('organization.isMni')}
                  </label>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='block flex flex-col gap-y-2' data-testid='organization-description'>
                    <label className='text-xl text-dial-blue required-field'>
                      {format('organization.description')}
                    </label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('organization.description')}
                          isInvalid={errors.description}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.description && <ValidationError value={errors.description?.message} />}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap text-xl mt-8 gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
                >
                  {`${format('organization.submit')} ${format('organization.label')}`}
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
          </form>
        </div>
      </div>
    </div>
  )
})

OrganizationForm.displayName = 'OrganizationForm'

export default OrganizationForm

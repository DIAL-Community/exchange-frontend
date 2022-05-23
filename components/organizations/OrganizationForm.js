import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { gql, useMutation } from '@apollo/client'
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

const generateMutationText = (mutationFunc) => {
  return `
    mutation (
      $name: String!,
      $slug: String!,
      $aliases: JSON,
      $imageFile: Upload,
      $website: String,
      $isEndorser: Boolean,
      $whenEndorsed: ISO8601Date,
      $endorserLevel: String,
      $isMni: Boolean,
      $description: String
    ) {
      ${mutationFunc}(
        name: $name,
        slug: $slug,
        aliases: $aliases,
        imageFile: $imageFile,
        website: $website,
        isEndorser: $isEndorser,
        whenEndorsed: $whenEndorsed,
        endorserLevel: $endorserLevel,
        isMni: $isMni,
        description: $description
      ) {
        organization {
          name
          slug
          aliases
          website
          isEndorser
          whenEndorsed
          endorserLevel
          isMni
          imageFile
          organizationDescription {
            description
            locale
          }
        }
        errors
      }
    }
  `
}

const MUTATE_ORGANIZATION = gql(generateMutationText('createOrganization'))

// eslint-disable-next-line react/display-name
export const OrganizationForm = React.memo(({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id: id }, values), [formatMessage])

  const router = useRouter()
  const [session] = useSession()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()
  const [updateOrganization, { data }] = useMutation(MUTATE_ORGANIZATION)

  const endorserLevelOptions = [
    { label: format('organization.endorserLevel.none'), value: 'none' },
    { label: format('organization.endorserLevel.bronze'), value: 'bronze' },
    { label: format('organization.endorserLevel.silver'), value: 'silver' },
    { label: format('organization.endorserLevel.gold'), value: 'gold' }
  ]

  const { handleSubmit, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: organization?.name,
      aliases: organization?.aliases?.length ? organization?.aliases.map(value => ({ value })) : [{ value: '' }],
      website: organization?.website,
      isEndorser: organization?.isEndorser,
      whenEndorsed: organization?.whenEndorsed ?? null,
      endorserLevel: endorserLevelOptions.find(({ value }) => value === organization?.endorserLevel) ?? endorserLevelOptions[0],
      isMni: organization?.isMni,
      description: organization?.organizationDescription?.description
    }
  })

  const [slug] = useState(organization?.slug ?? '')

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

  const navigateToOrganizationDetailPage = useCallback(() => {
    setMutating(false)
 
    showToast(format('organization.submitted'), 'success', 'top-center')

    const navigateToOrganizationDetailPage = setTimeout(() => {
      router.push(`/${router.locale}/organizations/${data.createOrganization.organization.slug}`)
    }, 800)

    return () => clearTimeout(navigateToOrganizationDetailPage)
  }, [data, format, router, showToast])

  useEffect(() => {
    if (data?.createOrganization?.errors.length === 0 && data?.createOrganization?.organization) {
      navigateToOrganizationDetailPage()
    }
  }, [data, navigateToOrganizationDetailPage])

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
        whenEndorsed,
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
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue' data-testid='organization-name'>
                    <p className='required-field'>{format('organization.name')}</p>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder={format('organization.name')} isInvalid={errors.name} />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </label>
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue'>
                    {format('organization.aliases')}
                    {aliases.map((alias, aliasIdx) => (
                      <div key={alias.id} className='flex gap-x-2'>
                        <Controller
                          name={`aliases.${aliasIdx}.value`}
                          control={control}
                          render={({ field }) => <Input {...field} placeholder={format('organization.alias')} />}
                        />
                        {isLastAlias(aliasIdx) && (
                          <IconButton
                            icon={<FaPlus />}
                            onClick={() => append({ value: '' })}
                          />
                        )}
                        {!isSingleAlias && (
                          <IconButton
                            icon={<FaMinus />}
                            onClick={() => remove(aliasIdx)}
                          />
                        )}
                      </div>
                    ))}
                  </label>
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue' data-testid='organization-website'>
                    <p className='required-field'>{format('organization.website')}</p>
                    <Controller
                      name='website'
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder={format('organization.website')} isInvalid={errors.website} />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.website && <ValidationError value={errors.website?.message} />}
                  </label>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
                      {format('organization.imageFile')}
                    </label>
                    <Controller
                      name='imageFile'
                      control={control}
                      render={({ field }) => <FileUploader {...field} placeholder={format('organization.imageFile')} />}
                    />
                  </div>
                  <label className='flex gap-x-2 mb-2 items-center self-start text-xl text-dial-blue'>
                    <Controller
                      name='isEndorser'
                      control={control}
                      render={({ field }) => <Checkbox {...field} />}
                    />
                    {format('organization.isEndorser')}
                  </label>
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue'>
                    {format('organization.whenEndorsed')}
                    <Controller
                      name='whenEndorsed'
                      control={control}
                      render={({ field }) => <Input {...field} type='date' placeholder={format('organization.whenEndorsed')} />}
                    />
                  </label>
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue'>
                    {format('organization.endorserLevel')}
                    <Controller
                      name='endorserLevel'
                      control={control}
                      render={({ field }) => <Select {...field} options={endorserLevelOptions} placeholder={format('organization.endorserLevel')} />}
                    />
                  </label>
                  <label className='flex gap-x-2 mb-2 items-center self-start text-xl text-dial-blue'>
                    <Controller
                      name='isMni'
                      control={control}
                      render={({ field }) => <Checkbox {...field} />}
                    />
                    {format('organization.isMni')}
                  </label>
                </div>
                <div className='w-full lg:w-1/2' style={{ minHeight: '20rem' }}>
                  <label className='block flex flex-col gap-y-2 text-xl text-dial-blue' data-testid='organization-description'>
                    <p className='required-field'>{format('organization.description')}</p>
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
                  </label>
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

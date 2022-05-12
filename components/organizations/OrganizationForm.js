import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
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

// eslint-disable-next-line react/display-name
export const OrganizationForm = React.memo(({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id: id }, values), [formatMessage])

  const router = useRouter()
  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const endorserLevelOptions = [
    { label: format('organization.endorserLevel.none'), value: 'none' },
    { label: format('organization.endorserLevel.bronze'), value: 'bronze' },
    { label: format('organization.endorserLevel.silver'), value: 'silver' },
    { label: format('organization.endorserLevel.gold'), value: 'gold' }
  ]

  const { handleSubmit, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: organization?.name,
      aliases: organization?.aliases?.length ? organization?.aliases : [{ value: '' }],
      website: organization?.website,
      isEndorser: organization?.isEndorser,
      whenEndorsed: organization?.whenEndorsed,
      endorserLevel: endorserLevelOptions.find(({ value }) => value === organization?.endorserLevel) ?? endorserLevelOptions[0],
      isMni: organization?.isMni,
      description: organization?.organizationDescription?.description
    }
  })

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const cancelForm = () => {
    setReverting(true)
    let route = '/organizations'
    if (organization) {
      route = `${route}/${organization.slug}`
    }

    router.push(route)
  }

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

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])

  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1
  
  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit()}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {organization
                  ? format('app.edit-entity', { entity: organization.name })
                  : `${format('app.create-new')} ${format('organization.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue'>
                    {format('organization.name')}
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => <Input {...field} placeholder={format('organization.name')} />}
                    />
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
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue'>
                    {format('organization.website')}
                    <Controller
                      name='website'
                      control={control}
                      render={({ field }) => <Input {...field} type='text' placeholder={format('organization.website')} />}
                    />
                  </label>
                  <label className='flex flex-col gap-y-2 mb-2 text-xl text-dial-blue'>
                    {format('organization.imageFile')}
                    <Controller
                      name='imageFile'
                      control={control}
                      render={({ field }) => <FileUploader {...field} type='file' placeholder={format('organization.imageFile')} />}
                    />
                  </label>
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
                  <label className='block flex flex-col gap-y-2 text-xl text-dial-blue'>
                    {format('organization.description')}
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('organization.description')}
                        />
                      )}
                    />
                  </label>
                </div>
              </div>
              <div className='flex font-semibold text-xl mt-8 gap-3'>
                <button
                  type='submit'
                  className='bg-blue-500 text-dial-gray-light py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                >
                  {`${format('organization.submit')} ${format('organization.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='button'
                  className='bg-button-gray-light text-white py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3 inline' />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

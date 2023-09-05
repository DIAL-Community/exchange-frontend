import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import Select from '../shared/Select'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { Loading, Unauthorized } from '../shared/FetchStatus'
import { useUser } from '../../lib/hooks'
import { CREATE_BUILDING_BLOCK } from '../../mutations/building-block'
import { getCategoryOptions, getMaturityOptions } from '../../lib/utilities'
import FileUploader from '../shared/FileUploader'

const BuildingBlockForm = React.memo(({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = buildingBlock?.slug ?? ''

  const router = useRouter()
  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const maturityOptions = getMaturityOptions(format)
  const categoryOptions = getCategoryOptions(format)

  const [updateBuildingBlock, { reset }] = useMutation(CREATE_BUILDING_BLOCK, {
    onCompleted: (data) => {
      setMutating(false)
      const { createBuildingBlock: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        showToast(
          format('buildingBlock.submit.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/${router.locale}/building_blocks/${response?.buildingBlock.slug}`)
        )
      } else {
        showToast(format('buildingBlock.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('buildingBlock.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: buildingBlock?.name,
      maturity: maturityOptions.find(({ value: maturity }) => maturity === buildingBlock?.maturity),
      category: categoryOptions.find(({ value: category }) => category === buildingBlock?.category),
      description: buildingBlock?.buildingBlockDescription?.description,
      specUrl: buildingBlock?.specUrl
    }
  })

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (buildingBlock) {
      map[buildingBlock.slug] = buildingBlock.name
    }

    return map
  }, [buildingBlock, format])

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, maturity, category, imageFile, description, specUrl } = data
      const variables = {
        name,
        slug,
        maturity: maturity.value,
        category: category ? category.value : null,
        description,
        specUrl
      }

      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateBuildingBlock({
        variables,
        context: {
          headers: {
            'Accept-Language': router.locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/building_blocks/${buildingBlock?.slug ?? ''}`)
  }

  return (
    loadingUserSession ? <Loading /> : isAdminUser || isEditorUser ? (
      <div className='flex flex-col'>
        <div className='hidden lg:block px-8'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='pb-8 px-8'>
          <div id='content' className='sm:px-0 max-w-full mx-auto'>
            <form onSubmit={handleSubmit(doUpsert)}>
              <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
                <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                  {buildingBlock
                    ? format('app.editEntity', { entity: buildingBlock.name })
                    : `${format('app.createNew')} ${format('ui.buildingBlock.label')}`
                  }
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                    <div className='form-field-wrapper' data-testid='building-block-name'>
                      <label className='form-field-label required-field' htmlFor='name'>
                        {format('buildingBlock.name')}
                      </label>
                      <Input
                        {...register('name', { required: format('validation.required') })}
                        id='name'
                        placeholder={format('buildingBlock.name')}
                        isInvalid={errors.name}
                      />
                      {errors.name && <ValidationError value={errors.name?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='building-block-maturity'>
                      <label className='form-field-label required-field'>
                        {format('buildingBlock.maturity')}
                      </label>
                      <Controller
                        name='maturity'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isSearch
                            options={maturityOptions}
                            placeholder={format('buildingBlock.maturity')}
                            isInvalid={errors.maturity}
                          />
                        )}
                        rules={{ required: format('validation.required') }}
                      />
                      {errors.maturity && <ValidationError value={errors.maturity?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='building-block-category'>
                      <label className='form-field-label'>
                        {format('buildingBlock.category')}
                      </label>
                      <Controller
                        name='category'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isSearch
                            options={categoryOptions}
                            placeholder={format('buildingBlock.category')}
                          />
                        )}
                      />
                    </div>
                    <div className='form-field-wrapper'>
                      <label className='form-field-label'>
                        {format('buildingBlock.imageFile')}
                      </label>
                      <FileUploader {...register('imageFile')} />
                    </div>
                    <div className='form-field-wrapper'>
                      <label className='form-field-label'>
                        {format('buildingBlock.specUrl')}
                      </label>
                      <Input {...register('specUrl')} placeholder={format('buildingBlock.specUrl')} />
                    </div>
                  </div>
                  <div className='w-full lg:w-1/2'>
                    <div className='block flex flex-col gap-y-2' data-testid='building-block-description'>
                      <label className='form-field-label required-field'>
                        {format('buildingBlock.description')}
                      </label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <HtmlEditor
                            editorId='description-editor'
                            onChange={onChange}
                            initialContent={value}
                            placeholder={format('buildingBlock.description')}
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
                    {`${format('app.submit')} ${format('ui.buildingBlock.label')}`}
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
    ) : <Unauthorized />
  )
})

BuildingBlockForm.displayName = 'BuildingBlockForm'

export default BuildingBlockForm

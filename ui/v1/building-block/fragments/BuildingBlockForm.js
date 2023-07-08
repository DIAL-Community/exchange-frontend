import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import Select from '../../shared/form/Select'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_BUILDING_BLOCK } from '../../shared/mutation/buildingBlock'
import { generateCategoryOptions, generateMaturityOptions } from '../../shared/form/options'
import {
  PAGINATED_BUILDING_BLOCKS_QUERY,
  BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY
} from '../../shared/query/buildingBlock'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'

const BuildingBlockForm = React.memo(({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = buildingBlock?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()

  const maturityOptions = useMemo(() => generateMaturityOptions(format), [format])
  const categoryOptions = useMemo(() => generateCategoryOptions(format), [format])

  const [updateBuildingBlock, { reset }] = useMutation(CREATE_BUILDING_BLOCK, {
    refetchQueries: [
      {
        query: BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY,
        variables: { search: '' }
      },
      {
        query: PAGINATED_BUILDING_BLOCKS_QUERY,
        variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
      }
    ],
    onCompleted: (data) => {
      const { createBuildingBlock: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setMutating(false)
        showToast(format('buildingBlock.submit.success'), 'success', 'top-center', 1000, null, () =>
          router.push(`/${router.locale}${REBRAND_BASE_PATH}/building-blocks/${response?.buildingBlock?.slug}`)
        )
      } else {
        setMutating(false)
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
    router.push(`${REBRAND_BASE_PATH}/building-blocks/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='py-4 text-dial-ochre'>
          <div className='flex flex-col gap-y-4'>
            <div className='text-xl font-semibold'>
              {buildingBlock
                ? format('app.edit-entity', { entity: buildingBlock.name })
                : `${format('app.create-new')} ${format('buildingBlock.label')}`}
            </div>
            <div className='form-field-wrapper'>
              <label className='required-field' htmlFor='name'>
                {format('building-block.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('building-block.name')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='form-field-wrapper'>
              <label className='required-field'>{format('building-block.maturity')}</label>
              <Controller
                name='maturity'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isSearch
                    options={maturityOptions}
                    placeholder={format('building-block.maturity')}
                    isInvalid={errors.maturity}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.maturity && <ValidationError value={errors.maturity?.message} />}
            </div>
            <div className='form-field-wrapper'>
              <label>{format('buildingBlock.category')}</label>
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
              <label>{format('building-block.imageFile')}</label>
              <FileUploader {...register('imageFile')} />
            </div>
            <div className='form-field-wrapper'>
              <label>{format('building-block.specUrl')}</label>
              <Input {...register('specUrl')} placeholder={format('building-block.specUrl')} />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field'>{format('building-block.description')}</label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('building-block.description')}
                    isInvalid={errors.description}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.description && <ValidationError value={errors.description?.message} />}
            </div>
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button type='submit' className='submit-button' disabled={mutating || reverting}>
                {`${format('app.submit')} ${format('buildingBlock.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
            {buildingBlock?.markdownUrl && (
              <div className='text-sm italic text-red-500 -mt-3'>{format('buildingBlock.markdownWarning')}</div>
            )}
          </div>
        </div>
      </form>
      : <Unauthorized />
})

BuildingBlockForm.displayName = 'BuildingBlockForm'

export default BuildingBlockForm

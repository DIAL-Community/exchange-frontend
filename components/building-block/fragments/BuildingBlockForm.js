import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import { generateCategoryOptions, generateMaturityOptions } from '../../shared/form/options'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_BUILDING_BLOCK } from '../../shared/mutation/buildingBlock'
import {
  BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_BUILDING_BLOCKS_QUERY
} from '../../shared/query/buildingBlock'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const BuildingBlockForm = memo(({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = buildingBlock?.slug ?? ''

  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const maturityOptions = useMemo(() => generateMaturityOptions(format), [format])
  const categoryOptions = useMemo(() => generateCategoryOptions(format), [format])

  const [updateBuildingBlock, { reset }] = useMutation(CREATE_BUILDING_BLOCK, {
    refetchQueries: [{
      query: BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_BUILDING_BLOCKS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { createBuildingBlock: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}/building-blocks/${response?.buildingBlock?.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.buildingBlock.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.label') }))
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: buildingBlock?.name,
      maturity: maturityOptions.find(({ value: maturity }) => maturity === buildingBlock?.maturity),
      category: categoryOptions.find(({ value: category }) => category === buildingBlock?.category),
      description: buildingBlock?.buildingBlockDescription?.description,
      specUrl: buildingBlock?.specUrl ?? '',
      govStackEntity: buildingBlock?.govStackEntity
    }
  })

  const doUpsert = async (data) => {
    setMutating(true)
    const { name, maturity, category, imageFile, description, specUrl, govStackEntity } = data
    const variables = {
      name,
      slug,
      maturity: maturity.value,
      category: category ? category.value : null,
      description,
      specUrl,
      govStackEntity
    }

    if (imageFile) {
      variables.imageFile = imageFile[0]
    }

    updateBuildingBlock({
      variables,
      context: {
        headers: {
          'Accept-Language': router.locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/building-blocks/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-ochre'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {buildingBlock
              ? format('app.editEntity', { entity: buildingBlock.name })
              : `${format('app.createNew')} ${format('ui.buildingBlock.label')}`}
          </div>
          <div className='form-field-wrapper'>
            <label className='required-field' htmlFor='name'>
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
          <div className='form-field-wrapper'>
            <label className='required-field'>{format('buildingBlock.maturity')}</label>
            <Controller
              name='maturity'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isSearch
                  isBorderless
                  options={maturityOptions}
                  placeholder={format('buildingBlock.maturity')}
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
                  isBorderless
                  options={categoryOptions}
                  placeholder={format('buildingBlock.category')}
                />
              )}
            />
          </div>
          <div className='form-field-wrapper'>
            <label>{format('buildingBlock.imageFile')}</label>
            <FileUploader {...register('imageFile')} />
          </div>
          <div className='form-field-wrapper'>
            <label>{format('buildingBlock.specUrl')}</label>
            <Controller
              name='specUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  value={value}
                  onChange={onChange}
                  placeholder={format('buildingBlock.specUrl')}
                  id='specUrl'
                />
              )}
            />
          </div>
          {user?.isAdminUser &&
            <label className='flex gap-x-2 items-center self-start'>
              <Checkbox {...register('govStackEntity')} />
              {format('ui.buildingBlock.govStackEntity')}
            </label>
          }
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('buildingBlock.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  initialContent={value}
                  labelledBy='description'
                  placeholder={format('buildingBlock.description')}
                  onChange={onChange}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.buildingBlock.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3' />}
            </button>
          </div>
          {buildingBlock?.markdownUrl && (
            <div className='text-sm italic text-red-500 -mt-3'>
              {format('buildingBlock.markdownWarning')}
            </div>
          )}
        </div>
      </div>
    </form>
  )
})

BuildingBlockForm.displayName = 'BuildingBlockForm'

export default BuildingBlockForm

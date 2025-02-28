import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import { generateMaturityOptions } from '../../shared/form/options'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_USE_CASE } from '../../shared/mutation/useCase'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'
import { PAGINATED_USE_CASES_QUERY, USE_CASE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/useCase'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const UseCaseForm = React.memo(({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = useCase?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { data: sectorsData } = useQuery(SECTOR_SEARCH_QUERY, {
    variables: { search: '', locale },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const sectorOptions = useMemo(
    () =>
      sectorsData?.sectors?.map(({ id, slug, name }) => ({
        label: name,
        value: parseInt(id),
        slug
      })) ?? [],
    [sectorsData]
  )

  const maturityOptions = useMemo(() => generateMaturityOptions(format), [format])

  const [updateUseCase, { reset }] = useMutation(CREATE_USE_CASE, {
    refetchQueries: [{
      query: USE_CASE_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_USE_CASES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { createUseCase: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}/use-cases/${response?.useCase?.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.useCase.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.useCase.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.useCase.label') }))
      setMutating(false)
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: useCase?.name,
      maturity: maturityOptions.find(({ value }) => value === useCase?.maturity),
      description: useCase?.useCaseDescription?.description,
      markdownUrl: useCase?.markdownUrl ?? '',
      govStackEntity: useCase?.govStackEntity
    }
  })

  useEffect(
    () =>
      setValue(
        'sector',
        sectorOptions.find(({ slug }) => slug === useCase?.sector?.slug)
      ),
    [sectorOptions, setValue, useCase?.sector?.slug]
  )

  const doUpsert = async (data) => {
    setMutating(true)
    const { name, sector, maturity, imageFile, description, markdownUrl, govStackEntity } = data
    const variables = {
      name,
      slug,
      sectorSlug: sector.slug,
      maturity: maturity.value,
      description,
      markdownUrl,
      govStackEntity
    }
    if (imageFile) {
      variables.imageFile = imageFile[0]
    }

    updateUseCase({
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
    router.push(`/${locale}/use-cases/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold text-dial-blueberry'>
            {useCase
              ? format('app.editEntity', { entity: useCase.name })
              : `${format('app.createNew')} ${format('ui.useCase.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field text-dial-blueberry' htmlFor='name'>
              {format('useCase.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              className='text-sm'
              placeholder={format('useCase.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field text-dial-blueberry' htmlFor='use-case-sector'>
              {format('useCase.sector')}
            </label>
            <Controller
              name='sector'
              control={control}
              rules={{ required: format('validation.required') }}
              defaultValue={sectorOptions.find(({ slug }) => slug === useCase?.sector?.slug)}
              render={({ field }) => (
                <Select
                  id='use-case-sector'
                  {...field}
                  isSearch
                  isBorderless
                  options={sectorOptions}
                  placeholder={format('useCase.sector')}
                  isInvalid={errors.sector}
                />
              )}
            />
            {errors.sector && <ValidationError value={errors.sector?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field text-dial-blueberry' htmlFor='use-case-maturity'>
              {format('useCase.maturity')}
            </label>
            <Controller
              name='maturity'
              control={control}
              rules={{ required: format('validation.required') }}
              render={({ field }) => (
                <Select
                  id='use-case-maturity'
                  {...field}
                  isSearch
                  isBorderless
                  options={maturityOptions}
                  placeholder={format('useCase.maturity')}
                  isInvalid={errors.maturity}
                />
              )}
            />
            {errors.maturity && <ValidationError value={errors.maturity?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='markdown-url'>
              {format('useCase.markdownUrl')}
            </label>
            <Controller
              id='markdownUrl'
              name='markdownUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='markdown-url'
                  onChange={onChange}
                  placeholder={format('useCase.markdownUrl')}
                  value={value}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='image-uploader'>
              {format('useCase.imageFile')}
            </label>
            <FileUploader {...register('imageFile')} id='image-uploader' />
          </div>
          {user?.isAdminUser &&
            <label className='flex gap-x-2 items-center self-start text-dial-sapphire'>
              <Checkbox {...register('govStackEntity')} />
              {format('ui.useCase.govStackEntity')}
            </label>
          }
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field'>{format('useCase.description')}</label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='use-case-description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('useCase.description')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.useCase.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3' />}
            </button>
          </div>
          {useCase?.markdownUrl && (
            <div className='text-sm italic text-red-500 -mt-3'>
              {format('useCase.markdownWarning')}
            </div>
          )}
        </div>
      </div>
    </form>
  )
})

UseCaseForm.displayName = 'UseCaseForm'

export default UseCaseForm

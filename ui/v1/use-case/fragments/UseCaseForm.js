import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
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
import { CREATE_USE_CASE } from '../../shared/mutation/useCase'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'
import { generateMaturityOptions } from '../../shared/form/options'
import { PAGINATED_USE_CASES_QUERY, USE_CASE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/useCase'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'

const UseCaseForm = React.memo(({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = useCase?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { data: sectorsData, loading: loadingSectors } = useQuery(SECTOR_SEARCH_QUERY, {
    variables: { search: '', locale }
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
    refetchQueries: [
      {
        query: USE_CASE_PAGINATION_ATTRIBUTES_QUERY,
        variables: { search: '' }
      },
      {
        query: PAGINATED_USE_CASES_QUERY,
        variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
      }
    ],
    onCompleted: (data) => {
      const { createUseCase: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setMutating(false)
        showToast(format('useCase.submit.success'), 'success', 'top-center', 1000, null, () =>
          router.push(`/${router.locale}${REBRAND_BASE_PATH}/use-cases/${response?.useCase?.slug}`)
        )
      } else {
        setMutating(false)
        showToast(format('useCase.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('useCase.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
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
      markdownUrl: useCase?.markdownUrl
    }
  })

  useEffect(
    () =>
      setValue(
        'sector',
        sectorOptions.find(({ slug }) => slug === useCase?.sector.slug)
      ),
    [sectorOptions, setValue, useCase?.sector.slug]
  )

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, sector, maturity, imageFile, description, markdownUrl } = data
      const variables = {
        name,
        slug,
        sectorSlug: sector.slug,
        maturity: maturity.value,
        description,
        markdownUrl
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateUseCase({
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
    router.push(`${REBRAND_BASE_PATH}/use-cases/${slug}`)
  }

  return loadingUserSession || loadingSectors
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='py-4'>
          <div className='flex flex-col gap-y-4'>
            <div className='text-xl font-semibold text-dial-blueberry'>
              {useCase
                ? format('app.edit-entity', { entity: useCase.name })
                : `${format('app.create-new')} ${format('useCase.label')}`}
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
                defaultValue={sectorOptions.find(({ slug }) => slug === useCase?.sector.slug)}
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
              <Input {...register('markdownUrl')} id='markdown-url' placeholder={format('useCase.markdownUrl')} />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-dial-sapphire' htmlFor='image-uploader'>
                {format('useCase.imageFile')}
              </label>
              <FileUploader {...register('imageFile')} id='image-uploader' />
            </div>
            <div className='block flex flex-col gap-y-2'>
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
                {`${format('app.submit')} ${format('useCase.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
            {useCase?.markdownUrl && (
              <div className='text-sm italic text-red-500 -mt-3'>{format('useCase.markdownWarning')}</div>
            )}
          </div>
        </div>
      </form>
      : <Unauthorized />
})

UseCaseForm.displayName = 'UseCaseForm'

export default UseCaseForm

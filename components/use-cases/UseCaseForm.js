import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import Select from '../shared/Select'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { Loading, Unauthorized } from '../shared/FetchStatus'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { CREATE_USE_CASE } from '../../mutations/use-case'
import FileUploader from '../shared/FileUploader'
import { useUser } from '../../lib/hooks'
import { getMaturityOptions } from '../../lib/utilities'

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

  const sectorOptions = useMemo(() => (
    sectorsData?.sectors?.map(
      ({ id, slug, name }) => ({
        label: name,
        value: parseInt(id),
        slug
      })
    ) ?? []
  ), [sectorsData])

  const maturityOptions = useMemo(() => getMaturityOptions(format), [format])

  const [updateUseCase, { reset }] = useMutation(CREATE_USE_CASE, {
    onCompleted: (data) => {
      const { createUseCase: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setMutating(false)
        showToast(
          format('useCase.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`/${router.locale}/use_cases/${response?.useCase?.slug}`)
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

  const { handleSubmit, register, setValue, control, formState: { errors } } = useForm({
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
    () => setValue('sector', sectorOptions.find(({ slug }) => slug === useCase?.sector.slug)),
    [sectorOptions, setValue, useCase?.sector.slug]
  )

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (useCase) {
      map[useCase.slug] = useCase.name
    }

    return map
  }, [useCase, format])

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
    router.push(`/use_cases/${slug}`)
  }

  return (
    (loadingUserSession || loadingSectors) ? <Loading /> : isAdminUser || isEditorUser ? (
      <div className='flex flex-col'>
        <div className='hidden lg:block px-8'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='pb-8 px-8'>
          <div id='content' className='sm:px-0 max-w-full mx-auto'>
            <form onSubmit={handleSubmit(doUpsert)}>
              <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
                <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                  {useCase
                    ? format('app.edit-entity', { entity: useCase.name })
                    : `${format('app.create-new')} ${format('useCase.label')}`
                  }
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
                    <div className='flex flex-col gap-y-2 mb-2' data-testid='use-case-name'>
                      <label className='text-dial-sapphire required-field' htmlFor='name'>
                        {format('useCase.name')}
                      </label>
                      <Input
                        {...register('name', { required: format('validation.required') })}
                        id='name'
                        placeholder={format('useCase.name')}
                        isInvalid={errors.name}
                      />
                      {errors.name && <ValidationError value={errors.name?.message} />}
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2' data-testid='use-case-sector'>
                      <label className='required-field text-dial-sapphire'>
                        {format('useCase.sector')}
                      </label>
                      <Controller
                        name='sector'
                        control={control}
                        rules={{ required: format('validation.required') }}
                        defaultValue={sectorOptions.find(({ slug }) => slug === useCase?.sector.slug)}
                        render={({ field }) => (
                          <Select
                            name='use-case-sector'
                            {...field}
                            isSearch
                            options={sectorOptions}
                            placeholder={format('useCase.sector')}
                            isInvalid={errors.sector}
                          />
                        )}
                      />
                      {errors.sector && <ValidationError value={errors.sector?.message} />}
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2' data-testid='use-case-maturity'>
                      <label className='required-field text-dial-sapphire'>
                        {format('useCase.maturity')}
                      </label>
                      <Controller
                        name='maturity'
                        control={control}
                        rules={{ required: format('validation.required') }}
                        render={({ field }) => (
                          <Select
                            name='use-case-maturity'
                            {...field}
                            isSearch
                            options={maturityOptions}
                            placeholder={format('useCase.maturity')}
                            isInvalid={errors.maturity}
                          />
                        )}
                      />
                      {errors.maturity && <ValidationError value={errors.maturity?.message} />}
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2'>
                      <label className='text-dial-sapphire' htmlFor='markdownUrl'>
                        {format('useCase.markdownUrl')}
                      </label>
                      <Input
                        {...register('markdownUrl')}
                        id='markdownUrl'
                        placeholder={format('useCase.markdownUrl')}
                      />
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2'>
                      <label className='text-dial-sapphire'>
                        {format('useCase.imageFile')}
                      </label>
                      <FileUploader {...register('imageFile')} />
                    </div>
                  </div>
                  <div className='w-full lg:w-2/3'>
                    <div className='block flex flex-col gap-y-2' data-testid='use-case-description'>
                      <label className='text-dial-sapphire required-field'>
                        {format('useCase.description')}
                      </label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <HtmlEditor
                            editorId='description-editor'
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
                  </div>
                </div>
                <div className='flex flex-wrap text-xl mt-8 gap-3'>
                  <button
                    type='submit'
                    className='submit-button'
                    disabled={mutating || reverting}
                    data-testid='submit-button'
                  >
                    {`${format('app.submit')} ${format('useCase.label')}`}
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

UseCaseForm.displayName = 'UseCaseForm'

export default UseCaseForm

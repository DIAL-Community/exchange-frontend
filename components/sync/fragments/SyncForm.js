import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_SYNC } from '../../shared/mutation/sync'
import { PAGINATED_SYNCS_QUERY, SYNC_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/sync'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const SyncForm = React.memo(({ sync }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = sync?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateSync, { reset }] = useMutation(CREATE_SYNC, {
    refetchQueries: [{
      query: SYNC_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_SYNCS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createSync.sync && data.createSync.errors.length === 0) {
        const redirectPath = `/${locale}/syncs/${data.createSync.sync.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.sync.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sync.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sync.label') }))
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: sync?.name,
      description: sync?.description,
      source: sync?.tenantSource,
      destination: sync?.tenantDestination,
      synchronizedModels: sync?.syncConfiguration['models'] || []
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        description,
        source,
        destination,
        synchronizedModels
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        description,
        source,
        destination,
        synchronizedModels
      }

      updateSync({
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
    router.push(`/${locale}/syncs/${slug}`)
  }

  const SYNCHRONIZABLE_MODELS = [{
    'label': format('ui.product.label'),
    'value': 'Product'
  }, {
    'label': format('ui.useCase.label'),
    'value': 'UseCase'
  }, {
    'label': format('ui.buildingBlock.label'),
    'value': 'BuildingBlock'
  }]

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {sync
                  ? format('app.editEntity', { entity: sync.name })
                  : `${format('app.createNew')} ${format('ui.sync.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
                  {format('ui.sync.name.label')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.sync.name.label')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
                  {format('ui.sync.source.label')}
                </label>
                <Input
                  {...register('source', { required: format('validation.required') })}
                  id='source'
                  placeholder={format('ui.sync.source.label')}
                  isInvalid={errors.source}
                />
                {errors.source && <ValidationError value={errors.source?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
                  {format('ui.sync.destination.label')}
                </label>
                <Input
                  {...register('destination', { required: format('validation.required') })}
                  id='destination'
                  placeholder={format('ui.sync.destination.label')}
                  isInvalid={errors.destination}
                />
                {errors.destination && <ValidationError value={errors.destination?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field'>
                  {format('ui.sync.description')}
                </label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='description-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('ui.sync.description')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <div className='text-dial-sapphire required-field'>
                {format('ui.sync.synchronizedModels')}
              </div>
              <div className='grid grid-cols-2 gap-4 text-dial-sapphire'>
                {SYNCHRONIZABLE_MODELS.map(({ label, value }) => (
                  <label key={value} className='flex gap-x-2 items-center'>
                    <input
                      type='checkbox'
                      value={value}
                      {...register('synchronizedModels')}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.sync.label')}`}
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
      : <Unauthorized />
})

SyncForm.displayName = 'SyncForm'

export default SyncForm

import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_REGION } from '../../shared/mutation/region'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { REGION_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_REGIONS_QUERY } from '../../shared/query/region'
import { HtmlEditor } from '../../shared/form/HtmlEditor'

const RegionForm = React.memo(({ region }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = region?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateRegion, { reset }] = useMutation(CREATE_REGION, {
    refetchQueries: [{
      query: REGION_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_REGIONS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createRegion.region && data.createRegion.errors.length === 0) {
        const redirectPath = `/${locale}/regions/${data.createRegion.region.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.region.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.region.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.region.label') }))
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: region?.name,
      description: region?.description
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
        description
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        description
      }

      updateRegion({
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
    router.push(`/${locale}/regions/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {region
                  ? format('app.editEntity', { entity: region.name })
                  : `${format('app.createNew')} ${format('ui.region.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
                  {format('ui.region.name.label')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.region.name.label')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field'>
                  {format('ui.region.description.label')}
                </label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='description-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('region.description')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.region.label')}`}
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

RegionForm.displayName = 'RegionForm'

export default RegionForm

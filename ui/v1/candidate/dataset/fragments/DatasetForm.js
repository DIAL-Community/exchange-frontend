import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import {  FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../../lib/ToastContext'
import { useUser } from '../../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../../components/shared/FetchStatus'
import Input from '../../../shared/form/Input'
import ValidationError from '../../../shared/form/ValidationError'
import FileUploader from '../../../shared/form/FileUploader'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { CREATE_CANDIDATE_DATASET } from '../../../shared/mutation/candidateDataset'
import { REBRAND_BASE_PATH } from '../../../utils/constants'
import UrlInput from '../../../shared/form/UrlInput'

const DatasetForm = React.memo(({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = dataset?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateDataset, { reset }] = useMutation(CREATE_CANDIDATE_DATASET, {
    onCompleted: (data) => {
      const { createCandidateDataset: response } = data
      if (response.candidateDataset && response.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${router.locale}${REBRAND_BASE_PATH}` +
                             `/candidate/datasets/${response.candidateDataset.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showToast(format('candidateDataset.submit.success'), 'success', 'top-center', 1000, null, redirectHandler)
      } else {
        setMutating(false)
        showToast(format('candidateDataset.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('candidateDataset.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: dataset?.name,
      website: dataset?.website,
      description: dataset?.description
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
        imageFile,
        website,
        description
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        website,
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateDataset({
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
    router.push(`${REBRAND_BASE_PATH}/candidate/datasets/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {dataset
                ? format('app.editEntity', { entity: dataset.name })
                : `${format('app.createNew')} ${format('dataset.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('dataset.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('dataset.name')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='website'>
                {format('dataset.website')}
              </label>
              <Controller
                id='website'
                name='website'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput value={value} onChange={onChange} id='website' placeholder={format('dataset.website')} />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>{format('dataset.imageFile')}</label>
              <FileUploader {...register('imageFile')} />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field'>{format('dataset.description')}</label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('dataset.description')}
                    isInvalid={errors.description}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.description && <ValidationError value={errors.description?.message} />}
            </div>
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button type='submit' className='submit-button' disabled={mutating || reverting}>
                {`${format('app.submit')} ${format('dataset.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </div>
      </form>
      : <Unauthorized />
})

DatasetForm.displayName = 'DatasetForm'

export default DatasetForm

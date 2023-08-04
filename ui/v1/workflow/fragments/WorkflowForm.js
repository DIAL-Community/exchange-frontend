import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_WORKFLOW } from '../../shared/mutation/workflow'
import { REBRAND_BASE_PATH } from '../../utils/constants'

const WorkflowForm = React.memo(({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = workflow?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateWorkflow, { reset }] = useMutation(CREATE_WORKFLOW, {
    onCompleted: (data) => {
      if (data.createWorkflow.workflow && data.createWorkflow.errors.length === 0) {
        const redirectPath = `/${router.locale}${REBRAND_BASE_PATH}/workflows/${data.createWorkflow.workflow.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showToast(
          format('workflow.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          redirectHandler
        )
      } else {
        setMutating(false)
        showToast(format('workflow.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('workflow.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: workflow?.name,
      description: workflow?.workflowDescription?.description
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, imageFile, description } = data
      const variables = {
        name,
        slug,
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateWorkflow({
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
    router.push(`${REBRAND_BASE_PATH}/workflows/${slug}`)
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {workflow
              ? format('app.editEntity', { entity: workflow.name })
              : `${format('app.createNew')} ${format('workflow.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('workflow.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('workflow.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire'>{format('workflow.imageFile')}</label>
            <FileUploader {...register('imageFile')} />
          </div>
          <div className='block flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field'>
              {format('workflow.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('workflow.description')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('workflow.label')}`}
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
  ) : (
    <Unauthorized />
  )
})

WorkflowForm.displayName = 'WorkflowForm'

export default WorkflowForm

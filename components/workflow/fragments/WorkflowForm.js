import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_WORKFLOW } from '../../shared/mutation/workflow'
import { PAGINATED_WORKFLOWS_QUERY, WORKFLOW_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/workflow'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const WorkflowForm = React.memo(({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = workflow?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateWorkflow, { reset }] = useMutation(CREATE_WORKFLOW, {
    refetchQueries: [{
      query: WORKFLOW_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_WORKFLOWS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      if (data.createWorkflow.workflow && data.createWorkflow.errors.length === 0) {
        const redirectPath = `/${locale}/workflows/${data.createWorkflow.workflow.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.workflow.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.workflow.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.workflow.label') }))
      setMutating(false)
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
    setMutating(true)
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
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/workflows/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {workflow
              ? format('app.editEntity', { entity: workflow.name })
              : `${format('app.createNew')} ${format('ui.workflow.label')}`}
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
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='text-dial-sapphire required-field'>
              {format('workflow.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('workflow.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.workflow.label')}`}
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
})

WorkflowForm.displayName = 'WorkflowForm'

export default WorkflowForm

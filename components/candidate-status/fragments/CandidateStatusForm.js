import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_CANDIDATE_STATUS } from '../../shared/mutation/candidateStatus'
import {
  CANDIDATE_STATUS_PAGINATION_ATTRIBUTES_QUERY, CANDIDATE_STATUS_SEARCH_QUERY, PAGINATED_CANDIDATE_STATUSES_QUERY
} from '../../shared/query/candidateStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const CandidateStatusForm = React.memo(({ candidateStatus }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = candidateStatus?.slug ?? ''

  const client = useApolloClient()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateCandidateStatus, { reset }] = useMutation(CREATE_CANDIDATE_STATUS, {
    refetchQueries: [{
      query: CANDIDATE_STATUS_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_CANDIDATE_STATUSES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { createCandidateStatus: response } = data
      if (response.candidateStatus && response.errors.length === 0) {
        const redirectPath = `/${locale}/candidate-statuses/${response.candidateStatus.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.candidateStatus.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateStatus.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateStatus.label') }))
      setMutating(false)
      reset()
    }
  })

  const defaultNotificationTemplate = `
    <p>
      Hi {{current-user}},
    </p>
    <p>
      Your candidate's status, '{{candidate-name}}', has been updated.
    </p>
    <p>
      The previous status was '{{previous-status}}' and the current status is '{{current-status}}'.
    </p>
  `

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: candidateStatus?.name,
      description: candidateStatus?.description,
      initialStatus: candidateStatus?.initialStatus,
      terminalStatus: candidateStatus?.terminalStatus,
      notificationTemplate: candidateStatus?.notificationTemplate ?? defaultNotificationTemplate,
      nextCandidateStatuses: candidateStatus?.nextCandidateStatuses.map(nextCandidateStatus => {
        return {
          label: nextCandidateStatus.name,
          value: nextCandidateStatus.slug
        }
      })
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nextCandidateStatuses'
  })

  const doUpsert = async (data) => {
    const {
      name,
      description,
      initialStatus,
      terminalStatus,
      notificationTemplate,
      nextCandidateStatuses
    } = data
    const variables = {
      slug,
      name,
      description,
      initialStatus,
      terminalStatus,
      notificationTemplate,
      nextCandidateStatusSlugs: nextCandidateStatuses.filter(n => n.value).map(n => n.value)
    }

    updateCandidateStatus({
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
    router.push(`/${locale}/candidate-statuses/${slug}`)
  }

  const fetchedCandidateStatusesCallback = (data) => (
    data?.candidateStatuses?.filter(c => c.slug !== slug).map((candidateStatus) => ({
      label: candidateStatus.name,
      value: candidateStatus.slug
    }))
  )

  const loadCandidateStatusOptions = (input) =>
    fetchSelectOptions(client, input, CANDIDATE_STATUS_SEARCH_QUERY, fetchedCandidateStatusesCallback)

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {candidateStatus
              ? format('app.editEntity', { entity: candidateStatus.name })
              : `${format('app.createNew')} ${format('ui.candidateStatus.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.candidateStatus.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('ui.candidateStatus.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register('initialStatus')} />
            {format('ui.candidateStatus.initialStatus')}
          </label>
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register('terminalStatus')} />
            {format('ui.candidateStatus.terminalStatus')}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' for='description'>
              {format('ui.candidateStatus.description')}
            </label>
            <Controller
              id='description'
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='description-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('ui.candidateStatus.description')}
                  isInvalid={errors.description}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <hr className='border-b border-dial-blue-chalk my-3' />
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-row gap-x-2'>
              <div className='text-sm'>
                {format('ui.candidateStatus.nextCandidateStatus.header')}
              </div>
              <button
                type='button'
                className='bg-dial-iris-blue text-white px-3 py-3 rounded shadow ml-auto'
                onClick={() => append(
                  {},
                  { focusIndex: fields.length }
                )}
              >
                <FaPlus />
              </button>
            </div>
            {fields.map((f, index) => (
              <div key={f.id} className='flex flex-col gap-y-2'>
                <label className='required-field sr-only' htmlFor={`next-candidate-statuses-${index}`}>
                  {format('ui.candidateStatus.nextCandidateStatus.label')}
                </label>
                <div className='flex flex-row gap-x-2'>
                  <Controller
                    id={`next-candidate-statuses-${index}`}
                    control={control}
                    name={`nextCandidateStatuses.${index}`}
                    render={({ field: { onChange, value } }) => {
                      const currentValue = value ?? f

                      return (
                        <Select
                          async
                          isBorderless
                          cacheOptions
                          defaultOptions
                          className='w-full'
                          loadOptions={loadCandidateStatusOptions}
                          onChange={(currentValue) => {
                            onChange(currentValue)
                          }}
                          value={currentValue}
                        />
                      )
                    }}
                  />
                  <button
                    type='button'
                    className='bg-red-500 text-white px-3 rounded shadow'
                    onClick={() => remove(index)}
                  >
                    <FaMinus />
                  </button>
                </div>
                {errors.nextCandidateStatuses?.[index]
                  && <ValidationError value={errors.nextCandidateStatuses?.[index]?.message} />
                }
              </div>
            ))}
          </div>
          <hr className='border-b border-dial-blue-chalk my-3' />
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' for='notification-template'>
              {format('ui.candidateStatus.notificationTemplate')}
            </label>
            <Controller
              id='notification-template'
              name='notificationTemplate'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='notification-template-editor'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('ui.candidateStatus.notificationTemplate')}
                  isInvalid={errors.notificationTemplate}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.notificationTemplate && <ValidationError value={errors.notificationTemplate?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.candidateStatus.label')}`}
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

CandidateStatusForm.displayName = 'CandidateStatusForm'

export default CandidateStatusForm

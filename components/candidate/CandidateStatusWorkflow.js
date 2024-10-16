import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import EditButton from '../shared/form/EditButton'
import { HtmlEditor } from '../shared/form/HtmlEditor'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import Select from '../shared/form/Select'
import ValidationError from '../shared/form/ValidationError'
import { CANDIDATE_PRODUCT_DETAIL_QUERY } from '../shared/query/candidateProduct'
import { INITIAL_CANDIDATE_STATUS_SEARCH_QUERY } from '../shared/query/candidateStatus'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../shared/query/comment'
import { fetchSelectOptions } from '../utils/search'

const CandidateStatusWorkflow = ({ candidate, objectType, mutationQuery }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [editing, setEditing] = useState(false)
  const [mutating, setMutating] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { rejected, candidateStatus } = candidate

  const toggleEditing = () => {
    setMutating(true)
    setEditing(!editing)
    setMutating(false)
  }

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProduct, { reset }] = useMutation(mutationQuery, {
    refetchQueries: [{
      query: COMMENTS_COUNT_QUERY,
      variables: {
        commentObjectId: parseInt(candidate.id),
        commentObjectType: objectType
      }
    }, {
      query: COMMENTS_QUERY,
      variables: {
        commentObjectId: parseInt(candidate.id),
        commentObjectType: objectType
      }
    }, {
      query: CANDIDATE_PRODUCT_DETAIL_QUERY,
      variables: {
        slug: candidate.slug
      }
    }],
    onCompleted: (data) => {
      const { updateCandidateProductStatus: response } = data
      if (response.candidateProduct && response.errors.length === 0) {
        toggleEditing()
        setMutating(false)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.candidateStatus.label') })
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

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  const nextCandidateStatusWatcher = watch('nextCandidateStatus')

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { description, nextCandidateStatus } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        slug: candidate.slug,
        description,
        candidateStatusSlug: nextCandidateStatus.value
      }

      updateProduct({
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

  const client = useApolloClient()

  const fetchedCandidateStatusesCallback = (data) => (
    data?.initialCandidateStatuses?.map((c) => ({
      label: c.name,
      value: c.slug,
      initialStatus: c.initialStatus,
      terminalStatus: c.terminalStatus
    }))
  )

  const loadCandidateStatusOptions = async (input) => {
    if (candidateStatus) {
      if (candidateStatus.initialStatus) {
        const nextCandidateStatuses = candidateStatus
          .nextCandidateStatuses
          .filter(c => input !== null && c.name.indexOf(input) !== -1)
          .map(c => ({
            label: c.name,
            value: c.slug,
            initialStatus: c.initialStatus,
            terminalStatus: c.terminalStatus
          }))

        const options = await fetchSelectOptions(
          client,
          input,
          INITIAL_CANDIDATE_STATUS_SEARCH_QUERY,
          fetchedCandidateStatusesCallback
        )

        return [{
          label: format('ui.candidateStatus.initialCandidateStatus.header'),
          options
        }, {
          label: format('ui.candidateStatus.nextCandidateStatus.header'),
          options: nextCandidateStatuses
        }]
      } else {
        return candidateStatus
          .nextCandidateStatuses
          .filter(c => input !== null && c.name.indexOf(input) !== -1)
          .map(c => ({
            label: c.name,
            value: c.slug,
            initialStatus: c.initialStatus,
            terminalStatus: c.terminalStatus
          }))
      }
    } else {
      return fetchSelectOptions(client, input, INITIAL_CANDIDATE_STATUS_SEARCH_QUERY, fetchedCandidateStatusesCallback)
    }
  }

  const editView = () => (
    <form onSubmit={handleSubmit(doUpsert)} className='bg-dial-alice-blue px-6 py-4'>
      <div className='flex flex-col gap-y-6 text-sm'>
        <div className='flex flex-col gap-y-2'>
          <div className='font-normal'>
            {format('ui.candidate.candidateStatus.currentCandidateStatus')}
          </div>
          <div className='font-semibold'>
            {candidateStatus ? candidateStatus.name : format('ui.candidate.received')}
          </div>
        </div>
        <div className='flex flex-col gap-y-2'>
          <label htmlFor='next-candidate-status' className='required-field'>
            {format('ui.candidate.candidateStatus.nextCandidateStatus')}
          </label>
          <Controller
            id='next-candidate-status'
            name='nextCandidateStatus'
            control={control}
            render={({ field: { onChange, value } }) =>
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
                value={value}
              />
            }
          />
          {errors.nextCandidateStatus && <ValidationError value={errors.nextCandidateStatus?.message} />}
        </div>
        <div className='flex flex-col gap-y-2'>
          <label
            htmlFor='status-update-justification'
            className={nextCandidateStatusWatcher?.terminalStatus ? 'required-field' : undefined}
          >
            {format('ui.candidate.candidateStatus.updateJustification')}
          </label>
          <Controller
            id='status-update-justification'
            name='description'
            control={control}
            render={({ field: { value, onChange } }) => (
              <HtmlEditor
                editorId='description-editor'
                onChange={onChange}
                initialContent={value}
                placeholder={format('ui.candidate.candidateStatus.updateJustification')}
              />
            )}
            rules={{
              required: {
                value: nextCandidateStatusWatcher?.terminalStatus,
                message: format('validation.required')
              }
            }}
          />
          {errors.description && <ValidationError value={errors.description?.message} />}
        </div>
        <div className='ml-auto flex flex-wrap gap-3 text-sm'>
          <button
            type='submit'
            className='submit-button'
            disabled={mutating}
          >
            {format('app.submit')}
            {mutating && <FaSpinner className='spinner ml-3' />}
          </button>
          <button type='button'
            className='cancel-button'
            disabled={mutating}
            onClick={toggleEditing}
          >
            {format('app.cancel')}
            {mutating && <FaSpinner className='spinner ml-3' />}
          </button>
        </div>
      </div>
    </form>
  )

  const valueView = () => (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-col lg:flex-row gap-2'>
        <div className='text-base text-dial-meadow font-semibold'>
          {format('ui.candidate.candidateStatus')}
        </div>
        {rejected === null &&
          <div className='ml-auto'>
            <EditButton type='button' onClick={toggleEditing} />
          </div>
        }
      </div>
      <div className='flex flex-col'>
        <div className='text-sm'>
          {candidateStatus ? candidateStatus.name : format('ui.candidate.received')}
        </div>
        <div className='text-base'>
          {candidateStatus
            ? <HtmlViewer
              initialContent={candidateStatus.description}
              extraClassNames='text-xs'
            />
            : <HtmlViewer
              initialContent={format('ui.candidate.received.description')}
              extraClassNames='text-xs'
            />
          }
        </div>
      </div>
    </div>
  )

  return rejected === null && editing ? editView() : valueView()
}

export default CandidateStatusWorkflow

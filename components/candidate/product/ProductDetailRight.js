import { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { FormattedDate, useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import CommentsSection from '../../shared/comment/CommentsSection'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import EditButton from '../../shared/form/EditButton'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CANDIDATE_PRODUCT_UPDATE_STATUS } from '../../shared/mutation/candidateProduct'
import { INITIAL_CANDIDATE_STATUS_SEARCH_QUERY } from '../../shared/query/candidateStatus'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../../shared/query/comment'
import { ObjectType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'
import { prependUrlWithProtocol } from '../../utils/utilities'

const CandidateStatusWorkflow = ({ candidate }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [editing, setEditing] = useState(false)
  const [mutating, setMutating] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { candidateStatus } = candidate

  const toggleEditing = () => {
    setMutating(true)
    setEditing(!editing)
    setMutating(false)
  }

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProduct, { reset }] = useMutation(CANDIDATE_PRODUCT_UPDATE_STATUS, {
    refetchQueries: [{
      query: COMMENTS_COUNT_QUERY,
      variables: {
        commentObjectId: parseInt(candidate.id),
        commentObjectType: ObjectType.CANDIDATE_PRODUCT
      }
    },
    {
      query: COMMENTS_QUERY,
      variables: {
        commentObjectId: parseInt(candidate.id),
        commentObjectType: ObjectType.CANDIDATE_PRODUCT
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
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { description, candidateStatus } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        slug: candidate.slug,
        description,
        candidateStatusSlug: candidateStatus.value
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
      value: c.slug
    }))
  )

  const loadCandidateStatusOptions = (input) => {
    if (candidateStatus) {
      return Promise.resolve(
        candidateStatus
          .nextCandidateStatuses
          .filter(c => input !== null && c.name.indexOf(input) !== -1)
          .map(c => ({
            label: c.name,
            value: c.slug
          }))
      )
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
          <label className='required-field'>
            {format('ui.candidate.candidateStatus.nextCandidateStatus')}
          </label>
          <Controller
            id='candidateStatus'
            name='candidateStatus'
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
          {errors.candidateStatus && <ValidationError value={errors.candidateStatus?.message} />}
        </div>
        <div className='flex flex-col gap-y-2'>
          <label htmlFor='statusUpdateReason'>
            {format('ui.candidate.candidateStatus.updateReason')}
          </label>
          <Controller
            id='statusUpdateReason'
            name='description'
            control={control}
            render={({ field: { value, onChange } }) => (
              <HtmlEditor
                editorId='description-editor'
                onChange={onChange}
                initialContent={value}
                placeholder={format('ui.candidate.candidateStatus.updateReason')}
              />
            )}
          />
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
        <div className='ml-auto'>
          <EditButton type='button' onClick={toggleEditing} />
        </div>
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

  return editing ? editView() : valueView()
}

const ProductDetailRight = forwardRef(({ product }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const editPath = `${product.slug}/edit`

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={product?.description}
            editorId='product-description'
          />
        </div>
        {product.repository &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('product.repository')}
              </div>
              <div className='my-auto text-sm flex'>
                <a href={prependUrlWithProtocol(product.repository)} target='_blank' rel='noreferrer'>
                  <div className='border-b border-dial-iris-blue line-clamp-1 break-all'>
                    {product.repository}
                  </div>
                </a>
                &nbsp;⧉
              </div>
            </div>
          </>
        }
        {product.submitterEmail &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.candidate.submitter')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${product.submitterEmail}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {product.submitterEmail}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
                <FormattedDate value={product.createdAt} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <CandidateStatusWorkflow candidate={product} />
        {`${product.rejected}` === 'true' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-red-700'>
                {format('ui.candidate.rejectedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${product.rejectedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {product.rejectedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.rejectedOn')}:</span>
                <FormattedDate value={product.rejectedDate} />
              </div>
            </div>
          </>
        }
        {`${product.rejected}` === 'false' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-green-700'>
                {format('ui.candidate.approvedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${product.approvedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {product.approvedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.approvedOn')}:</span>
                <FormattedDate value={product.approvedDate} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={product} objectType={ObjectType.CANDIDATE_PRODUCT} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={product.id}
          objectType={ObjectType.CANDIDATE_PRODUCT}
        />
      </div>
    </div>
  )
})

ProductDetailRight.displayName = 'ProductDetailRight'

export default ProductDetailRight

import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'
import classNames from 'classnames'
import { useCallback, useContext, useEffect, useState } from 'react'
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { CandidateActionType, CandidateStatusType } from '../../../lib/constants'
import { ToastContext } from '../../../lib/ToastContext'
import { APPROVE_CANDIDATE_ROLE, REJECT_CANDIDATE_ROLE } from '../../../mutations/candidate'
import { useUser } from '../../../lib/hooks'

const RoleCard = ({ role, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className={`card ${status === 'rejection' || status === 'approval' ? 'flip-horizontal' : ''}`}>
              <div className='card-body border-3 border-transparent cursor-pointer'>
                <div
                  className={classNames(
                    { 'bg-red-50': role.rejected === true || status === CandidateStatusType.REJECTED },
                    { 'bg-emerald-50': role.rejected === false || status === CandidateStatusType.APPROVED },
                    'card-front border border-dial-gray shadow-sm'
                  )}
                >
                  <div className='flex flex-col xl:flex-row gap-3 p-3'>
                    <div className='flex flex-col gap-3 w-full xl:w-2/3 '>
                      <div className='my-auto line-clamp-1 font-semibold'>
                        {format('candidate.email')}: {role.email}
                      </div>
                      <div className='line-clamp-1'>
                        <span className='font-semibold'>
                          {format('candidate.applied')}:
                        </span>
                        {`
                          ${role.roles} -
                          ${
                            role.product ? role.product.name :
                              role.organization ? role.organization.name :
                                role.dataset ? role.dataset.name : ''
                          }
                        `}
                      </div>
                      <div className='line-clamp-2'>
                        {role.description && parse(role.description)}
                      </div>
                    </div>
                    <div className='absolute right-3 text-sm text-dial-cyan font-semibold'>
                      <div className='px-2 py-1 border border-dial-cyan rounded'>
                        {format('candidate.role.label').toUpperCase()}
                      </div>
                    </div>
                    <div className='ml-auto mt-auto'>
                      {
                        role.rejected === null &&
                        status !== CandidateStatusType.APPROVED &&
                        status !== CandidateStatusType.REJECTED &&
                          <div className='ml-auto flex flex-row gap-3'>
                            <ToggleRejectionButton {...{ setStatus, loading }} style='text-sm secondary-button' />
                            <ToggleApprovalButton {...{ setStatus, loading }} style='text-sm submit-button' />
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className={classNames(
                  'card-back flip-horizontal border border-dial-gray shadow-sm bg-dial-gray h-full',
                  { 'bg-red-50': role.rejected === true || status === CandidateStatusType.REJECTED },
                  { 'bg-emerald-50': role.rejected === false || status === CandidateStatusType.APPROVED }
                )}>
                  <div className='flex flex-col gap-3 p-3 h-full'>
                    <div className='flex flex-row xl:hidden text-dial-gray-dark text-sm font-semibold'>
                      <div className='ml-auto my-auto p-1.5 border border-dial-gray-dark rounded'>
                        {format('candidate.role.label').toUpperCase()}
                      </div>
                    </div>
                    <label className='block'>
                      <span className='sr-only text-gray-700'>{format('candidate.feedback')}</span>
                      <input
                        type='text'
                        className='w-full'
                        placeholder={format('candidate.feedback.placeholder')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <div className='ml-auto mt-auto flex flex-row gap-3'>
                      {
                        status === CandidateStatusType.REJECTION &&
                        <>
                          <CancelButton {...{ status, setStatus, loading }} />
                          <DeclineButton {...{ status, setStatus, loading, setLoading, role }} />
                        </>
                      }
                      {
                        status === CandidateStatusType.APPROVAL &&
                        <>
                          <CancelButton {...{ status, setStatus, loading }} />
                          <ApproveButton {...{ status, setStatus, loading, setLoading, role }} />
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <div className={`card ${status === 'rejection' || status === 'approval' ? 'flip-vertical' : ''}`}>
              <div className='card-body border-3 border-transparent text-dial-purple cursor-pointer h-full'>
                <div className='card-front h-full flex flex-col border border-dial-gray card-drop-shadow'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray'>
                    {
                      (String(role.rejected) === 'true' || status === 'rejected') &&
                        <div className='bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                          {format('candidate.rejected').toUpperCase()}
                        </div>
                    }
                    {
                      (String(role.rejected) === 'false' || status === 'approved') &&
                        <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                          {format('candidate.approved').toUpperCase()}
                        </div>
                    }
                    <div className='ml-auto my-auto py-1 px-2 text-dial-cyan text-sm font-semibold'>
                      {format('candidate.role.header').toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 h-64 p-3'>
                    <div className='text-2xl font-semibold break-all line-clamp-1'>
                      {role.email}
                    </div>
                    <div className='line-clamp-1'>
                      {`${format('candidate.role.name')}: ${role.roles}`}
                    </div>
                    <div className='line-clamp-6'>
                      {role.description && parse(role.description)}
                    </div>
                  </div>
                  {
                    role.rejected === null &&
                    status !== CandidateStatusType.APPROVED &&
                    status !== CandidateStatusType.REJECTED &&
                      <div className='py-3 flex flex-col gap-3 bg-dial-gray-light text-dial-gray-dark mt-auto'>
                        <div className='ml-auto flex flex-row gap-3 mx-3'>
                          <ToggleRejectionButton {...{ setStatus, loading }} style='text-sm secondary-button' />
                          <ToggleApprovalButton {...{ setStatus, loading }} style='text-sm submit-button' />
                        </div>
                      </div>
                  }
                </div>
                <div className='card-back flip-vertical h-full flex flex-col border border-dial-gray bg-dial-gray shadow-lg'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray-dark bg-dial-gray-dark product-card-header'>
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidate.role.header').toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 p-3 h-full'>
                    <label className='block'>
                      <span className='text-gray-700'>{format('candidate.feedback')}</span>
                      <textarea
                        className='form-textarea mt-1 block w-full'
                        rows={8}
                        placeholder={format('candidate.feedback.placeholder')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <div className='ml-auto mt-auto flex flex-row gap-3'>
                      {
                        status === CandidateStatusType.REJECTION &&
                        <>
                          <CancelButton {...{ status, setStatus, loading }} />
                          <DeclineButton {...{ status, setStatus, loading, setLoading, role }} />
                        </>
                      }
                      {
                        status === CandidateStatusType.APPROVAL &&
                        <>
                          <CancelButton {...{ status, setStatus, loading }} />
                          <ApproveButton {...{ status, setStatus, loading, setLoading, role }} />
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
      }
    </>
  )
}

const CancelButton = ({ status, setStatus, loading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <button
      className={classNames(
        'text-sm secondary-button',
        { 'block': status !== '' }, { 'hidden': status === '' }
      )}
      onClick={() => setStatus('')}
      disabled={loading}
    >
      {format('candidate.cancel')}
    </button>
  )
}

const ToggleApprovalButton = ({ style, setStatus, loading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <button
      className={style}
      onClick={() => setStatus(CandidateStatusType.APPROVAL)}
      disabled={loading}
    >
      {format('candidate.approve')}
      <FaRegCheckCircle className='ml-1 inline text-xl' />
    </button>
  )
}

const ApproveButton = ({ role, setStatus, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [executeMutation, { loading }] = useMutation(APPROVE_CANDIDATE_ROLE, {
    onCompleted: () => {
      setLoading(false)
      setStatus(CandidateStatusType.APPROVED)
      showToast(format('candidate.role.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setLoading(false)
      showToast(format('candidate.role.update.failure'), 'error', 'top-center')
    }
  })

  const approveCandidateRole = async (e) => {
    const { userEmail, userToken } = user

    e.preventDefault()
    setLoading(true)

    executeMutation({
      variables: {
        candidateRoleId: role.id,
        action: CandidateActionType.APPROVE
      },
      context: {
        headers: {
          'Accept-Language': locale,
          Authorization: `${userEmail} ${userToken}`
        }
      }
    })
  }

  return (
    <button className='text-sm submit-button' onClick={approveCandidateRole} disabled={loading}>
      {format('candidate.approve')}
      <FaRegCheckCircle className='ml-1 inline text-xl' />
    </button>
  )
}

const ToggleRejectionButton = ({ style, setStatus, loading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <button
      className={style}
      onClick={() => setStatus(CandidateStatusType.REJECTION)}
      disabled={loading}
    >
      {format('candidate.reject')}
      <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

const DeclineButton = ({ role, setStatus, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [executeMutation, { loading }] = useMutation(REJECT_CANDIDATE_ROLE, {
    onCompleted: () => {
      setLoading(false)
      setStatus(CandidateStatusType.REJECTED)
      showToast(format('candidate.role.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setLoading(false)
      showToast(format('candidate.role.update.failure'), 'error', 'top-center')
    }
  })

  const rejectCandidateRole = async (e) => {
    const { userEmail, userToken } = user

    e.preventDefault()
    setLoading(true)

    executeMutation({
      variables: {
        candidateRoleId: role.id,
        action: CandidateActionType.REJECT
      },
      context: {
        headers: {
          'Accept-Language': locale,
          Authorization: `${userEmail} ${userToken}`
        }
      }
    })
  }

  return (
    <button className='text-sm submit-button' onClick={rejectCandidateRole} disabled={loading}>
      {format('candidate.reject')}
      <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

export default RoleCard

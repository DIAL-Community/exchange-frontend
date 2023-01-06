import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { CandidateActionType } from '../../../lib/constants'
import { ToastContext } from '../../../lib/ToastContext'
import { APPROVE_CANDIDATE_ROLE, REJECT_CANDIDATE_ROLE } from '../../../mutations/candidate'

const ellipsisTextStyle = 'my-auto'

const RoleCard = ({ role, listType, filterDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()

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
              <div className='card-body border-3 border-transparent hover:border-dial-gray text-workflow cursor-pointer'>
                <div className={`
                  ${String(role.rejected) === 'true' || status === 'rejected'
                  ? 'bg-red-50'
                  : String(role.rejected) === 'false' || status === 'approved'
                    ? 'bg-emerald-50'
                    : 'bg-white'}
                  card-front border border-dial-gray hover:border-transparent shadow-sm
                `}
                >
                  <div className='grid grid-cols-12 gap-x-4 gap-y-2 my-4 px-4 text-product'>
                    <div className={`col-span-12 ${filterDisplayed ? 'lg:col-span-8' : 'md:col-span-8'}`}>
                      <div className={`col-span-12 lg:col-span-3 my-auto ${ellipsisTextStyle}`}>
                        {format('candidate.email')}: {role.email}
                      </div>
                      <div className={`col-span-12 lg:col-span-3 my-auto ${ellipsisTextStyle}`}>
                        ${`
                          ${format('candidate.applied')}:
                          ${role.roles} -
                          ${
                            role.product ? role.product.name :
                              role.organization ? role.organization.name :
                                role.dataset ? role.dataset.name : ''
                          }
                        `}
                      </div>
                      <div className={`col-span-12 lg:col-span-3 my-auto ${ellipsisTextStyle}`}>
                        {role.description}
                      </div>
                    </div>
                    <div className='col-span-12 lg:col-span-4 my-auto'>
                      {
                        String(role.rejected) === 'null' && session?.user?.canEdit &&
                          <div className='lg:col-span-3 flex flex-row'>
                            <ToggleRejectionButton
                              {...{ setStatus, loading }}
                              style={`
                                my-auto px-3 py-1 text-sm font-semibold ml-auto
                                border border-dial-gray-dark text-dial-gray-dark rounded
                                hover:bg-opacity-20 hover:bg-dial-gray-dark
                              `}
                            />
                            <ToggleApprovalButton
                              {...{ setStatus, loading }}
                              style={`
                                ml-3 my-auto px-3 py-1 text-sm font-semibold bg-dial-gray-dark text-white
                                border border-dial-gray-dark bg-dial-gray-dark text-white rounded
                                hover:bg-opacity-80
                              `}
                            />
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className={`
                  ${String(role.rejected) === 'true' || status === 'rejected'
                  ? 'bg-red-50'
                  : String(role.rejected) === 'false' || status === 'approved'
                    ? 'bg-emerald-50'
                    : 'bg-dial-gray'}
                  card-back flip-horizontal border border-dial-gray hover:border-transparent shadow-sm
                `}
                >
                  <div className='grid grid-cols-12 gap-x-4 gap-y-2 px-4 h-full text-product'>
                    <div className='col-span-12 lg:col-span-8 my-auto'>
                      <label className='block'>
                        <span className='sr-only text-gray-700'>{format('candidate.feedback')}</span>
                        <input
                          className='form-textarea w-full' type='text'
                          placeholder={format('candidate.feedback.placeholder')} value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className='col-span-12 lg:col-span-4 my-auto'>
                      <div className='flex flex-row'>
                        {
                          session?.user?.canEdit &&
                            <>
                              <CancelButton {...{ status, setStatus, loading }} />
                              <DeclineButton {...{ status, setStatus, loading, setLoading, role }} />
                              <ApproveButton {...{ status, setStatus, loading, setLoading, role }} />
                            </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <div className={`card ${status === 'rejection' || status === 'approval' ? 'flip-vertical' : ''}`}>
              <div className='card-body border-3 border-transparent hover:border-dial-gray text-dial-purple cursor-pointer h-full'>
                <div className='card-front h-full flex flex-col border border-dial-gray card-drop-shadow'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
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
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidateRole.label').toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                      {role.email}
                    </div>
                    <div className='m-auto w-40'>
                      {role.roles}
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='flex flex-col border-b border-dial-gray px-3'>
                      {role.description}
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='flex flex-col border-b border-dial-gray'>
                      {
                        String(role.rejected) === 'null' && session?.user?.canEdit && status === '' &&
                          <div className='pl-3 py-2 flex flex-row'>
                            <ToggleRejectionButton
                              {...{ setStatus, loading }}
                              style={`
                                my-auto px-3 py-1 text-sm font-semibold mr-auto
                                border border-dial-gray-dark text-dial-gray-dark rounded
                                hover:bg-opacity-20 hover:bg-dial-gray-dark
                              `}
                            />
                            <ToggleApprovalButton
                              {...{ setStatus, loading }}
                              style={`
                                mx-3 my-auto px-3 py-1 text-sm font-semibold ml-auto bg-dial-gray-dark text-white
                                border border-dial-gray-dark bg-dial-gray-dark text-white rounded
                                hover:bg-opacity-80
                              `}
                            />
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className='card-back flip-vertical h-full flex flex-col border border-dial-gray bg-dial-gray shadow-lg'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray-dark bg-dial-gray-dark product-card-header'>
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidateRole.label').toUpperCase()}
                    </div>
                  </div>
                  <div className='h-full p-3'>
                    <label className='block'>
                      <span className='text-gray-700'>{format('candidate.feedback')}</span>
                      <textarea
                        className='form-textarea mt-1 block w-full' rows='6' style={{ resize: 'none' }}
                        placeholder={format('candidate.feedback.placeholder')} value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <div className='py-2 flex flex-row'>
                      {
                        session?.user && session?.user.canEdit &&
                          <>
                            <CancelButton {...{ status, setStatus, loading }} />
                            <DeclineButton {...{ status, setStatus, loading, setLoading, role }} />
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
      className={`
          ${status !== '' ? 'block' : 'hidden'}
          ml-auto my-auto px-3 py-1 text-sm font-semibold
          border border-dial-gray-dark text-dial-gray-dark rounded
          hover:bg-opacity-20 hover:bg-dial-gray-dark
        `}
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
      onClick={() => setStatus('approval')}
      disabled={loading}
    >
      {format('candidate.approve')} <FaRegCheckCircle className='ml-1 inline text-xl text-emerald-500' />
    </button>
  )
}

const ApproveButton = ({ role, status, setStatus, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [executeMutation, { loading }] = useMutation(APPROVE_CANDIDATE_ROLE, {
    onCompleted: () => {
      setLoading(false)
      setStatus('approved')
      showToast(format('candidate.role.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setLoading(false)
      showToast(format('candidate.role.update.failure'), 'error', 'top-center')
    }
  })

  const approveCandidateRole = async (e) => {
    const { userEmail, userToken } = session.user

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
    <button
      className={`
        ${status === 'approval' ? 'block' : 'hidden'}
        ml-2 my-auto px-3 py-1 text-sm font-semibold
        border border-dial-gray-dark bg-dial-gray-dark text-white rounded
        hover:bg-opacity-80
      `}
      onClick={approveCandidateRole}
      disabled={loading}
    >
      {format('candidate.approve')} <FaRegCheckCircle className='ml-1 inline text-xl text-emerald-500' />
    </button>
  )
}

const ToggleRejectionButton = ({ style, setStatus, loading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <button
      className={style}
      onClick={() => setStatus('rejection')}
      disabled={loading}
    >
      {format('candidate.reject')}  <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

const DeclineButton = ({ role, status, setStatus, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [executeMutation, { loading }] = useMutation(REJECT_CANDIDATE_ROLE, {
    onCompleted: () => {
      setLoading(false)
      setStatus('approved')
      showToast(format('candidate.role.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setLoading(false)
      showToast(format('candidate.role.update.failure'), 'error', 'top-center')
    }
  })

  const rejectCandidateRole = async (e) => {
    const { userEmail, userToken } = session.user

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
    <button
      className={`
        ${status === 'rejection' ? 'block' : 'hidden'}
        ml-2 my-auto px-3 py-1 text-sm font-semibold
        border border-dial-gray-dark text-dial-gray-dark rounded
        hover:bg-opacity-20 hover:bg-dial-gray-dark
      `}
      onClick={rejectCandidateRole}
      disabled={loading}
    >
      {format('candidate.reject')}  <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

export default RoleCard

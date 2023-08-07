import React, { useCallback, useMemo, useState } from 'react'
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'
import classNames from 'classnames'
import { getDatasetTypeOptions, prependUrlWithProtocol } from '../../../lib/utilities'
import { CANDIDATE_DATASET_ACTION } from '../../../queries/candidate'
import { useUser } from '../../../lib/hooks'
import { CandidateActionType, CandidateStatusType } from '../../../lib/constants'

const hoverEffectTextStyle = 'border-b-2 border-transparent hover:border-dial-sunshine'

const DatasetCard = ({ dataset, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [comment, setComment] = useState('')

  const datasetType = useMemo(() =>
    getDatasetTypeOptions(format)
      .find((datasetOption) => dataset.dataType === datasetOption.value)
  , [dataset.dataType, format])

  const shouldFlipCard = (status) =>
    [CandidateStatusType.REJECTION, CandidateStatusType.APPROVAL].indexOf(status) >= 0

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className={classNames('card', { 'flip-horizontal':  shouldFlipCard(status) })}>
              <div className='card-body border-3 border-transparent'>
                <div className={classNames('card-front border border-dial-gray shadow-md bg-white',
                  { 'bg-red-50': dataset.rejected === true || status === CandidateStatusType.REJECTED },
                  { 'bg-emerald-50': dataset.rejected === false || status === CandidateStatusType.APPROVED }
                )}>
                  <div className='flex flex-col xl:flex-row gap-3 p-3'>
                    <div className='flex flex-col gap-3 w-full xl:w-2/3 '>
                      <div className='my-auto line-clamp-1 font-semibold'>
                        {dataset.name}
                      </div>
                      <div className='my-auto line-clamp-1 text-dial-blue'>
                        <a href={prependUrlWithProtocol(dataset.dataUrl)} target='_blank' rel='noreferrer'>
                          {dataset.dataUrl} ⧉
                        </a>
                      </div>
                      <div className='line-clamp-2'>
                        {dataset.description && parse(dataset.description)}
                      </div>
                      <div className='line-clamp-1'>
                        {dataset.submitterEmail}
                      </div>
                    </div>
                    <div className='absolute right-3 text-sm text-dial-cyan font-semibold'>
                      <div className='px-2 py-1 border border-dial-cyan rounded'>
                        {datasetType.label.toUpperCase()}
                      </div>
                    </div>
                    <div className='ml-auto mt-auto'>
                      {
                        dataset.rejected === null &&
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
                  { 'bg-red-50': dataset.rejected === true || status === CandidateStatusType.REJECTED },
                  { 'bg-emerald-50': dataset.rejected === false || status === CandidateStatusType.APPROVED }
                )}>
                  <div className='flex flex-col gap-3 p-3 h-full'>
                    <div className='flex flex-row xl:hidden text-dial-gray-dark text-sm font-semibold'>
                      <div className='ml-auto my-auto p-1.5 border border-dial-gray-dark rounded'>
                        {datasetType.label.toUpperCase()}
                      </div>
                    </div>
                    <label className='block'>
                      <span className='sr-only text-gray-700'>{format('candidate.feedback')}</span>
                      <input
                        className='w-full'
                        type='text'
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
                          <DeclineButton {...{ status, setStatus, loading, setLoading, dataset }} />
                        </>
                      }
                      {
                        status === CandidateStatusType.APPROVAL &&
                        <>
                          <CancelButton {...{ status, setStatus, loading }} />
                          <ApproveButton {...{ status, setStatus, loading, setLoading, dataset }} />
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <div className={classNames('card', { 'flip-vertical':  shouldFlipCard(status) })}>
              <div className='card-body border-3 border-transparent text-dial-purple h-full'>
                <div className='card-front h-full flex flex-col border border-dial-gray shadow-md'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray dataset-card-header'>
                    {
                      (dataset.rejected === true || status === CandidateStatusType.REJECTED) &&
                        <div className='bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                          {format('candidate.rejected').toUpperCase()}
                        </div>
                    }
                    {
                      (dataset.rejected === false || status === CandidateStatusType.APPROVED) &&
                        <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                          {format('candidate.approved').toUpperCase()}
                        </div>
                    }
                    {
                      dataset.rejected === null &&
                        <div className='ml-auto my-auto py-1 px-2 text-dial-cyan text-sm font-semibold'>
                          {format('candidateDataset.label').toUpperCase()}
                        </div>
                    }
                  </div>
                  <div className='flex flex-col h-64 p-4'>
                    <div className='text-2xl font-semibold'>
                      {dataset.name}
                    </div>
                    <div className='mt-3 line-clamp-6'>
                      {dataset.description && parse(dataset.description)}
                    </div>
                  </div>
                  <div className='py-3 flex flex-col gap-3 bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='px-3 ml-auto'>
                      {dataset.submitterEmail}
                    </div>
                    <div className='px-3 ml-auto flex flex-row'>
                      {
                        dataset.dataUrl
                          ? (
                            <a
                              href={prependUrlWithProtocol(dataset.dataUrl)}
                              target='_blank'
                              rel='noreferrer'
                              className={'py-1 px-2 bg-white text-dial-blue break-all line-clamp-1'}
                            >
                              <span className={hoverEffectTextStyle}>
                                {dataset.dataUrl} ⧉
                              </span>
                            </a>
                          )
                          : (
                            <div className='py-1 px-2 bg-white line-clamp-1'>
                              {format('general.na')}
                            </div>
                          )
                      }
                    </div>
                    <div className='px-3 my-auto flex flex-row'>
                      <div className='ml-auto px-2 py-1 bg-white'>
                        {datasetType.label}
                      </div>
                    </div>
                    {
                      dataset.rejected === null &&
                      status !== CandidateStatusType.APPROVED &&
                      status !== CandidateStatusType.REJECTED &&
                        <>
                          <div className='border-t'></div>
                          <div className='ml-auto flex flex-row gap-3 mx-3'>
                            <ToggleRejectionButton {...{ setStatus, loading }} style='text-sm secondary-button' />
                            <ToggleApprovalButton {...{ setStatus, loading }} style='text-sm submit-button' />
                          </div>
                        </>
                    }
                  </div>
                </div>
                <div className='card-back flip-vertical flex flex-col border border-dial-gray bg-dial-gray shadow-lg h-full'>
                  <div className='flex flex-row p-1.5 bg-dial-gray-dark'>
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidateDataset.label').toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 p-3 h-full'>
                    <label className='block'>
                      <span className='text-gray-700'>{format('candidate.feedback')}</span>
                      <textarea
                        className='w-full'
                        rows={8}
                        style={{ resize: 'none' }}
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
                            <DeclineButton {...{ status, setStatus, loading, setLoading, dataset }} />
                          </>
                      }
                      {
                        status === CandidateStatusType.APPROVAL &&
                        <>
                          <CancelButton {...{ status, setStatus, loading }} />
                          <ApproveButton {...{ status, setStatus, loading, setLoading, dataset }} />
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

const ApproveButton = ({ dataset, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { user } = useUser()

  const [candidateDatasetApproval, { reset }] = useMutation(CANDIDATE_DATASET_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateDataset: response } = data
      if (response?.candidateDataset && response?.errors?.length === 0) {
        setStatus(CandidateStatusType.APPROVED)
        setLoading(false)
      } else {
        setLoading(false)
        reset()
      }
    },
    onError: () => {
      setLoading(false)
      reset()
    }
  })

  const approveDataset = async () => {
    if (user) {
      setLoading(true)
      const { userEmail, userToken } = user

      candidateDatasetApproval({
        variables: {
          slug: dataset.slug,
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
  }

  return (
    <button className='text-sm submit-button' onClick={approveDataset} disabled={loading}>
      {format('candidate.approve')}<FaRegCheckCircle className='ml-1 inline text-xl' />
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

const DeclineButton = ({ dataset, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { user } = useUser()

  const [candidateDatasetApproval, { reset }] = useMutation(CANDIDATE_DATASET_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateDataset: response } = data
      if (response?.candidateDataset && response?.errors?.length === 0) {
        setStatus(CandidateStatusType.REJECTED)
        setLoading(false)
      } else {
        setLoading(false)
        reset()
      }
    },
    onError: () => {
      setLoading(false)
      reset()
    }
  })

  const rejectDataset = async () => {
    if (user) {
      setLoading(true)
      const { userEmail, userToken } = user
      const variables = {
        slug: dataset.slug,
        action: CandidateActionType.REJECT
      }

      candidateDatasetApproval({
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

  return (
    <button className='text-sm submit-button' onClick={rejectDataset} disabled={loading}>
      {format('candidate.reject')}
      <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

export default DatasetCard

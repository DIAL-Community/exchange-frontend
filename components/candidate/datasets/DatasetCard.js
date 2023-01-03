import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaFile, FaHome, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'
import classNames from 'classnames'
import { getDatasetTypeOptions, prependUrlWithProtocol, truncate } from '../../../lib/utilities'
import { CANDIDATE_DATASET_ACTION } from '../../../queries/candidate'
import { useUser } from '../../../lib/hooks'
import { CandidateActionType, CandidateStatusType } from '../../../lib/constants'

const ellipsisTextStyle = 'my-auto'
const hoverEffectTextStyle = 'border-b-2 border-transparent hover:border-dial-yellow'

const DatasetCard = ({ dataset, listType, filterDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [comment, setComment] = useState('')

  const datasetType = useMemo(() =>
    getDatasetTypeOptions(format).find(((datasetOption) => dataset.dataType === datasetOption.value))
  , [dataset.dataType, format])

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className={classNames('card', { 'flip-horizontal':  status === CandidateStatusType.REJECTION || status === CandidateStatusType.APPROVAL })}>
              <div className='card-body border-3 border-transparent hover:border-dial-gray'>
                <div className={classNames('card-front border border-dial-gray card-drop-shadow bg-white',
                  { 'bg-red-50': dataset.rejected === true || status === CandidateStatusType.REJECTED },
                  { 'bg-emerald-50': dataset.rejected === false || status === CandidateStatusType.APPROVED }
                )}>
                  <div className='grid grid-cols-12 gap-x-4 gap-y-2 my-4 px-4 text-dataset'>
                    <div className={classNames('col-span-12', { 'lg:col-span-3': filterDisplayed })}>
                      <div className={classNames('col-span-12 lg:col-span-3 my-auto', ellipsisTextStyle)}>
                        {dataset.name}
                      </div>
                      <div className={classNames('col-span-12 lg:col-span-3 my-auto', ellipsisTextStyle)}>
                        <a href={prependUrlWithProtocol(dataset.dataUrl)}>{dataset.dataUrl}</a>
                      </div>
                      <div className={classNames('col-span-12 lg:col-span-3 my-auto', ellipsisTextStyle)}>
                        {dataset.submitterEmail}
                      </div>
                    </div>
                    <div
                      className={classNames('col-span-12 lg:col-span-3', ellipsisTextStyle)}
                      data-tip={parse(dataset.description).props.children}
                    >
                      {parse(truncate(dataset.description, 140, true, true))}
                    </div>
                    <div className={classNames('col-span-12 my-auto', { 'lg:col-span-3': filterDisplayed })}>
                      {datasetType.label}
                    </div>
                    <div className='col-span-12 lg:col-span-3 my-auto'>
                      {
                        dataset.rejected === null && status === '' &&
                          <div className='lg:col-span-3 flex flex-row'>
                            <ToggleRejectionButton
                              {...{ setStatus, loading }}
                              style='my-auto px-3 py-1 text-sm font-semibold ml-auto border border-dial-gray-dark
                              text-dial-gray-dark rounded hover:bg-opacity-20 hover:bg-dial-gray-dark'
                            />
                            <ToggleApprovalButton
                              {...{ setStatus, loading }}
                              style='ml-3 my-auto px-3 py-1 text-sm font-semibold bg-dial-gray-dark text-white
                                border border-dial-gray-dark bg-dial-gray-dark text-white rounded hover:bg-opacity-80'
                            />
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className={classNames('card-back flip-horizontal border border-dial-gray hover:border-transparent shadow-sm bg-dial-gray',
                  { 'bg-red-50': dataset.rejected === true || status === CandidateStatusType.REJECTED },
                  { 'bg-emerald-50': dataset.rejected === false || status === CandidateStatusType.APPROVED }
                )}>
                  <div className='grid grid-cols-12 gap-x-4 gap-y-2 px-4 h-full text-dataset'>
                    <div className='col-span-12 lg:col-span-8 my-auto'>
                      <label className='block'>
                        <span className='sr-only text-gray-700'>{format('candidate.feedback')}</span>
                        <input
                          className='form-textarea w-full'
                          type='text'
                          placeholder={format('candidate.feedback.placeholder')}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className='col-span-12 lg:col-span-4 my-auto'>
                      <div className='flex flex-row'>
                        <CancelButton {...{ status, setStatus, loading }} />
                        <DeclineButton {...{ status, setStatus, loading, setLoading, dataset }} />
                        <ApproveButton {...{ status, setStatus, loading, setLoading, dataset }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <div className={classNames('card', { 'flip-vertical':  status === CandidateStatusType.REJECTION || status === CandidateStatusType.APPROVAL })}>
              <div className='card-body border-3 border-transparent hover:border-dial-gray text-dial-purple h-full'>
                <div className='card-front h-full flex flex-col border border-dial-gray card-drop-shadow'>
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
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidateDataset.label').toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold'>
                      {dataset.name}
                    </div>
                    <div className='mt-3 overflow-y-auto'>
                      {parse(dataset.description)}
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='flex flex-col border-b border-dial-gray px-3'>
                      {dataset.submitterEmail}
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark'>
                    <div className='flex flex-col border-b border-dial-gray'>
                      <div className='pl-3 py-2 flex flex-row border-b'>
                        <div className='w-6 my-auto'>
                          <FaHome className='text-xl' data-tip={format('candidateDataset.website.hint')} />
                        </div>
                        <div className={classNames('mx-2 my-auto px-2 py-1 bg-white', ellipsisTextStyle, hoverEffectTextStyle)}>
                          {
                            dataset.dataUrl
                              ? <a href={prependUrlWithProtocol(dataset.dataUrl)} target='_blank' rel='noreferrer'>{dataset.dataUrl}</a>
                              : format('general.na')
                          }
                        </div>
                      </div>
                      <div className={classNames('pl-3 flex flex-row py-2', { 'border-b': dataset.rejected === null })}>
                        <div className='w-6 my-auto'>
                          <FaFile className='text-xl' data-tip={format('candidateDataset.datasetType.hint')} />
                        </div>
                        <div className={classNames('mx-2 my-auto px-2 py-1 bg-white', ellipsisTextStyle, hoverEffectTextStyle)}>
                          {datasetType.label}
                        </div>
                      </div>
                      {
                        dataset.rejected === null && status === '' &&
                          <div className='pl-3 py-2 flex flex-row'>
                            <ToggleRejectionButton
                              {...{ setStatus, loading }}
                              style='my-auto px-3 py-1 text-sm font-semibold mr-auto border border-dial-gray-dark
                              text-dial-gray-dark rounded hover:bg-opacity-20 hover:bg-dial-gray-dark'
                            />
                            <ToggleApprovalButton
                              {...{ setStatus, loading }}
                              style='mx-3 my-auto px-3 py-1 text-sm font-semibold ml-auto bg-dial-gray-dark text-white
                                border border-dial-gray-dark bg-dial-gray-dark text-white rounded hover:bg-opacity-80'
                            />
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className='card-back flip-vertical h-full flex flex-col border border-dial-gray bg-dial-gray shadow-lg'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray-dark bg-dial-gray-dark dataset-card-header'>
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidateDataset.label').toUpperCase()}
                    </div>
                  </div>
                  <div className='h-full p-3'>
                    <label className='block'>
                      <span className='text-gray-700'>{format('candidate.feedback')}</span>
                      <textarea
                        className='form-textarea mt-1 block w-full'
                        rows='6'
                        style={{ resize: 'none' }}
                        placeholder={format('candidate.feedback.placeholder')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <div className='py-2 flex flex-row'>
                      <CancelButton {...{ status, setStatus, loading }} />
                      <DeclineButton {...{ status, setStatus, loading, setLoading, dataset }} />
                      <ApproveButton {...{ status, setStatus, loading, setLoading, dataset }} />
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
      className={classNames('ml-auto my-auto px-3 py-1 text-sm font-semibold border border-dial-gray-dark text-dial-gray-dark rounded hover:bg-opacity-20 hover:bg-dial-gray-dark',
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
      {format('candidate.approve')} <FaRegCheckCircle className='ml-1 inline text-xl text-emerald-500' />
    </button>
  )
}

const ApproveButton = ({ dataset, status, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { user } = useUser()

  const [candidateDatasetApproval] = useMutation(CANDIDATE_DATASET_ACTION, {
    onCompleted: () => {
      setStatus(CandidateStatusType.APPROVED)
      setLoading(false)
    },
    onError: () => setLoading(false)
  })

  const approveDataset = async () => {
    if (user) {
      setLoading(true)
      const { userEmail, userToken } = user

      candidateDatasetApproval({
        variables: {
          slug: dataset.slug,
          action: CandidateActionType.APPROVE,
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
    <button
      className={classNames(' ml-2 my-auto px-3 py-1 text-sm font-semibold border border-dial-gray-dark bg-dial-gray-dark text-white rounded hover:bg-opacity-80',
        { 'block': status === CandidateStatusType.APPROVAL }, { 'hidden': status !== CandidateStatusType.APPROVAL }
      )}
      onClick={approveDataset}
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
      onClick={() => setStatus(CandidateStatusType.REJECTION)}
      disabled={loading}
    >
      {format('candidate.reject')}  <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

const DeclineButton = ({ dataset, status, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { user } = useUser()

  const [candidateDatasetApproval] = useMutation(CANDIDATE_DATASET_ACTION, {
    onCompleted: () => {
      setStatus(CandidateStatusType.REJECTED)
      setLoading(false)
    },
    onError: () => setLoading(false)
  })
  const rejectDataset = async () => {
    if (user) {
      setLoading(true)
      const { userEmail, userToken } = user
      const variables = {
        slug: dataset.slug,
        action: CandidateActionType.REJECT,
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
    <button
      className={classNames(' ml-2 my-auto px-3 py-1 text-sm font-semibold border border-dial-gray-dark text-dial-gray-dark rounded hover:bg-opacity-20 hover:bg-dial-gray-dark',
        { 'block': status === CandidateStatusType.REJECTION }, { 'hidden': status !== CandidateStatusType.REJECTION }
      )}
      onClick={rejectDataset}
      disabled={loading}
    >
      {format('candidate.reject')}  <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

export default DatasetCard

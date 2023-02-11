import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { prependUrlWithProtocol } from '../../../lib/utilities'
import { useUser } from '../../../lib/hooks'
import { CandidateStatusType } from '../../../lib/constants'
import EditButton from '../../shared/EditButton'

const hoverEffectTextStyle = 'border-b-2 border-transparent hover:border-dial-yellow'

const ProductCard = ({ product, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const shouldFlipCard = (status) => [CandidateStatusType.REJECTION, CandidateStatusType.APPROVAL].indexOf(status) >= 0

  const listView =
    <div className={classNames('card', { 'flip-horizontal': shouldFlipCard(status) })}>
      <div className='card-body border-3 border-transparent'>
        <div className={classNames('card-front border border-dial-gray card-drop-shadow bg-white h-full',
          { 'bg-red-50': product.rejected === true || status === CandidateStatusType.REJECTED },
          { 'bg-emerald-50': product.rejected === false || status === CandidateStatusType.APPROVED }
        )}>
          <div className='flex flex-col xl:flex-row gap-3 p-3'>
            <div className='flex flex-col gap-3 w-full xl:w-2/3 '>
              <div className='my-auto line-clamp-1 font-semibold'>
                <Link href={`/candidate/products/${product.slug}`}>
                  <a className='border-b-2 border-transparent hover:border-dial-yellow'>
                    {product.name}
                  </a>
                </Link>
              </div>
              <div className='my-auto line-clamp-1 text-dial-blue'>
                <a href={prependUrlWithProtocol(product.website)}>{product.website} ⧉</a>
              </div>
              {
                product.description &&
                <div className='line-clamp-2'>
                  {parse(product.description)}
                </div>
              }
              <div className='line-clamp-1'>
                {product.submitterEmail}
              </div>
            </div>
            <div className='absolute right-3'>
              <div className='flex gap-1'>
                <div className='px-2 py-1 border border-dial-cyan rounded text-sm text-dial-cyan font-semibold'>
                  {format('candidateProduct.label').toUpperCase()}
                </div>
                {
                  product.rejected === null &&
                    <EditButton type='link' href={`/candidate/products/${product?.slug}/edit`} />
                }
              </div>
            </div>
            <div className='ml-auto mt-auto'>
              {
                product.rejected === null &&
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
          { 'bg-red-50': product.rejected === true || status === CandidateStatusType.REJECTED },
          { 'bg-emerald-50': product.rejected === false || status === CandidateStatusType.APPROVED }
        )}>
          <div className='flex flex-col gap-3 p-3 h-full'>
            <div className='flex flex-row xl:hidden text-sm font-semibold'>
              <div className='ml-auto my-auto p-1.5 border border-dial-gray-dark rounded'>
                {format('candidateProduct.label').toUpperCase()}
              </div>
            </div>
            <label className='flex flex-col'>
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
                  <DeclineButton {...{ status, setStatus, loading, setLoading, product }} />
                </>
              }
              {
                status === CandidateStatusType.APPROVAL &&
                <>
                  <CancelButton {...{ status, setStatus, loading }} />
                  <ApproveButton {...{ status, setStatus, loading, setLoading, product }} />
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  const cardView =
    <div className={classNames('card', { 'flip-vertical': shouldFlipCard(status) })}>
      <div className='card-body border-3 border-transparent text-product h-full'>
        <div className='card-front h-full flex flex-col border border-dial-gray  card-drop-shadow'>
          <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
            {
              (product.rejected === true || status === CandidateStatusType.REJECTED) &&
              <div className='bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                {format('candidate.rejected').toUpperCase()}
              </div>
            }
            {
              (product.rejected === false || status === CandidateStatusType.APPROVED) &&
              <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                {format('candidate.approved').toUpperCase()}
              </div>
            }
            <div className='ml-auto flex gap-1'>
              <div className='my-auto py-1 px-2 text-dial-cyan text-sm font-semibold'>
                {format('candidateProduct.label').toUpperCase()}
              </div>
              {
                product.rejected === null &&
                  <EditButton type='link' href={`/candidate/products/${product?.slug}/edit`} />
              }
            </div>
          </div>
          <div className='flex flex-col h-64 p-4'>
            <div className='text-2xl font-semibold'>
              <Link href={`/candidate/products/${product.slug}`}>
                <a className='border-b-2 border-transparent hover:border-dial-yellow'>
                  {product.name}
                </a>
              </Link>
            </div>
            <div className='mt-3 line-clamp-6'>
              {product.description && parse(product.description)}
            </div>
          </div>
          <div className='py-3 flex flex-col gap-3 bg-dial-gray-light text-dial-gray-dark mt-auto'>
            <div className='px-3 ml-auto'>
              {product.submitterEmail}
            </div>
            <div className='px-3 ml-auto'>
              {
                product.website
                  ? (
                    <a
                      href={prependUrlWithProtocol(product.website)}
                      target='_blank'
                      rel='noreferrer'
                      className={'py-1 px-2 bg-white text-dial-blue break-all line-clamp-1'}
                    >
                      <span className={hoverEffectTextStyle}>{product.website} ⧉</span>
                    </a>
                  )
                  : (
                    <div className='py-1 px-2 bg-white line-clamp-1'>
                      {format('general.na')}
                    </div>
                  )
              }
            </div>
            <div className='px-3 ml-auto'>
              {
                product.repository
                  ? (
                    <a
                      href={prependUrlWithProtocol(product.repository)}
                      target='_blank'
                      rel='noreferrer'
                      className={'py-1 px-2 bg-white text-dial-blue break-all line-clamp-1'}
                    >
                      <span className={hoverEffectTextStyle}>{product.repository} ⧉</span>
                    </a>
                  )
                  : (
                    <div className='py-1 px-2 bg-white line-clamp-1'>
                      {format('general.na')}
                    </div>
                  )
              }
            </div>
            {
              product.rejected === null &&
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
          <div className='flex flex-row p-1.5 bg-dial-gray-dark product-card-header'>
            <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
              {format('candidateProduct.label').toUpperCase()}
            </div>
          </div>
          <div className='flex flex-col gap-3 p-3 h-full '>
            <label className='flex flex-col gap-2'>
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
                  <DeclineButton {...{ status, setStatus, loading, setLoading, product }} />
                </>
              }
              {
                status === CandidateStatusType.APPROVAL &&
                <>
                  <CancelButton {...{ status, setStatus, loading }} />
                  <ApproveButton {...{ status, setStatus, loading, setLoading, product }} />
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <>
      { listType === 'list' ? listView : cardView }
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

const ApproveButton = ({ product, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const approveCandidateProduct = async (e) => {
    const { userEmail, userToken } = user

    e.preventDefault()
    setLoading(true)

    const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_products/${product.id}/approve` +
      `?user_email=${userEmail}&user_token=${userToken}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_RAILS_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      }
    })

    if (response.status === 200) {
      setStatus(CandidateStatusType.APPROVED)
    }

    setLoading(false)
  }

  return (
    <button className='text-sm submit-button' onClick={approveCandidateProduct} disabled={loading}>
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

const DeclineButton = ({ product, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const rejectCandidateProduct = async (e) => {
    const { userEmail, userToken } = user

    e.preventDefault()
    setLoading(true)

    const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_products/${product.id}/reject` +
      `?user_email=${userEmail}&user_token=${userToken}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_RAILS_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      }
    })

    if (response.status === 200) {
      setStatus(CandidateStatusType.REJECTED)
    }

    setLoading(false)
  }

  return (
    <button className='text-sm submit-button' onClick={rejectCandidateProduct} disabled={loading}>
      {format('candidate.reject')}
      <FaRegTimesCircle className='ml-1 inline text-xl' />
    </button>
  )
}

export default ProductCard

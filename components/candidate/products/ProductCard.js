import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { FaCode, FaHome, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { prependUrlWithProtocol } from '../../../lib/utilities'

const ellipsisTextStyle = 'my-auto'
const hoverEffectTextStyle = 'border-b-2 border-transparent hover:border-dial-yellow'

const ProductCard = ({ product, listType, filterDisplayed }) => {
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
              <div className='card-body border-3 border-transparent hover:border-dial-gray text-workflow'>
                <div className={`
                  ${String(product.rejected) === 'true' || status === 'rejected'
                  ? 'bg-red-50'
                  : String(product.rejected) === 'false' || status === 'approved'
                    ? 'bg-emerald-50'
                    : 'bg-white'}
                  card-front border border-dial-gray card-drop-shadow
                `}
                >
                  <div className='grid grid-cols-12 gap-x-4 gap-y-2 my-4 px-4 text-product'>
                    <div className={`col-span-12 ${filterDisplayed ? 'lg:col-span-8' : 'md:col-span-8'}`}>
                      <div className={`col-span-12 lg:col-span-3 my-auto ${ellipsisTextStyle}`}>
                        {product.name}
                      </div>
                      <div className={`col-span-12 lg:col-span-3 my-auto ${ellipsisTextStyle}`}>
                        <a href={prependUrlWithProtocol(product.website)}>{product.website}</a>
                      </div>
                      <div className={`col-span-12 lg:col-span-3 my-auto ${ellipsisTextStyle}`}>
                        {product.submitterEmail}
                      </div>
                    </div>
                    <div className='col-span-12 lg:col-span-4 my-auto'>
                      {
                        String(product.rejected) === 'null' && session?.user?.canEdit &&
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
                  ${String(product.rejected) === 'true' || status === 'rejected'
                  ? 'bg-red-50'
                  : String(product.rejected) === 'false' || status === 'approved'
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
                              <DeclineButton {...{ status, setStatus, loading, setLoading, product }} />
                              <ApproveButton {...{ status, setStatus, loading, setLoading, product }} />
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
              <div className='card-body border-3 border-transparent hover:border-dial-gray text-dial-purple h-full'>
                <div className='card-front h-full flex flex-col border border-dial-gray card-drop-shadow'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
                    {
                      (String(product.rejected) === 'true' || status === 'rejected') &&
                        <div className='bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                          {format('candidate.rejected').toUpperCase()}
                        </div>
                    }
                    {
                      (String(product.rejected) === 'false' || status === 'approved') &&
                        <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                          {format('candidate.approved').toUpperCase()}
                        </div>
                    }
                    <div className='ml-auto my-auto text-dial-cyan text-sm font-semibold'>
                      {format('candidateProduct.label').toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                      {product.name}
                    </div>
                    <div className='m-auto w-40'>
                      {product.description}
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='flex flex-col border-b border-dial-gray px-3'>
                      {product.submitterEmail}
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='flex flex-col border-b border-dial-gray'>
                      <div className='pl-3 py-2 flex flex-row border-b'>
                        <div className='w-6 my-auto'>
                          <FaHome className='text-xl' data-tip={format('candidateProduct.website.hint')} />
                        </div>
                        <div className={`mx-2 my-auto px-2 py-1 bg-white ${ellipsisTextStyle} ${hoverEffectTextStyle}`}>
                          {
                            product.website
                              ? <a href={prependUrlWithProtocol(product.website)} target='_blank' rel='noreferrer'>{product.website}</a>
                              : format('general.na')
                          }
                        </div>
                      </div>
                      <div className={`pl-3 flex flex-row ${String(product.rejected) === 'null' ? 'py-2 border-b' : 'py-2'}`}>
                        <div className='w-6 my-auto'>
                          <FaCode className='text-xl' data-tip={format('candidateProduct.repository.hint')} />
                        </div>
                        <div className={`mx-2 my-auto px-2 py-1 bg-white ${ellipsisTextStyle} ${hoverEffectTextStyle}`}>
                          {
                            product.repository
                              ? <a href={prependUrlWithProtocol(product.repository)} target='_blank' rel='noreferrer'>{product.repository}</a>
                              : format('general.na')
                          }
                        </div>
                      </div>
                      {
                        String(product.rejected) === 'null' && session?.user?.canEdit && status === '' &&
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
                      {format('candidateProduct.label').toUpperCase()}
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
                            <DeclineButton {...{ status, setStatus, loading, setLoading, product }} />
                            <ApproveButton {...{ status, setStatus, loading, setLoading, product }} />
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

const ApproveButton = ({ product, status, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()

  const approveCandidateProduct = async (e) => {
    const { userEmail, userToken } = session.user

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
      setStatus('approved')
    }

    setLoading(false)
  }

  return (
    <button
      className={`
        ${status === 'approval' ? 'block' : 'hidden'}
        ml-2 my-auto px-3 py-1 text-sm font-semibold
        border border-dial-gray-dark bg-dial-gray-dark text-white rounded
        hover:bg-opacity-80
      `}
      onClick={approveCandidateProduct}
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

const DeclineButton = ({ product, status, setStatus, loading, setLoading }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()

  const rejectCandidateProduct = async (e) => {
    const { userEmail, userToken } = session.user

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
      setStatus('rejected')
    }

    setLoading(false)
  }

  return (
    <button
      className={`
        ${status === 'rejection' ? 'block' : 'hidden'}
        ml-2 my-auto px-3 py-1 text-sm font-semibold
        border border-dial-gray-dark text-dial-gray-dark rounded
        hover:bg-opacity-20 hover:bg-dial-gray-dark
      `}
      onClick={rejectCandidateProduct}
      disabled={loading}
    >
      {format('candidate.reject')}  <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
    </button>
  )
}

export default ProductCard

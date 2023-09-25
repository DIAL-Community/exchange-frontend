import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { CandidateActionType } from '../../../utils/constants'

const ProductActionButton = ({ product, actionType, refetch }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const approveClickHandler = async () => {
    setLoading(true)
    if (user) {
      const { userEmail, userToken } = user
      const approvePath = process.env.NEXT_PUBLIC_RAILS_SERVER +
        `/candidate_products/${product.id}/approve` +
        `?user_email=${userEmail}&user_token=${userToken}`

      const response = await fetch(approvePath, {
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
        refetch({ variables: { slug: product.slug } })
      }
    }

    setLoading(false)
  }

  const rejectClickHandler = async () => {
    setLoading(true)
    if (user) {
      const { userEmail, userToken } = user
      const approvePath = process.env.NEXT_PUBLIC_RAILS_SERVER +
        `/candidate_products/${product.id}/reject` +
        `?user_email=${userEmail}&user_token=${userToken}`

      const response = await fetch(approvePath, {
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
        refetch({ variables: { slug: product.slug } })
      }
    }

    setLoading(false)
  }

  return (
    <>
      {actionType === CandidateActionType.REJECT && product.rejected === null &&
        <button
          className='bg-red-500 text-white rounded'
          onClick={rejectClickHandler}
          disabled={loading}
        >
          <div className='text-sm px-3 py-1'>
            {format('candidate.reject')}
          </div>
        </button>
      }
      {actionType === CandidateActionType.APPROVE && product.rejected === null &&
        <button
          className='bg-dial-meadow text-white rounded'
          onClick={approveClickHandler}
          disabled={loading}
        >
          <div className='text-sm px-3 py-1'>
            {format('candidate.approve')}
          </div>
        </button>
      }
    </>
  )
}

export default ProductActionButton

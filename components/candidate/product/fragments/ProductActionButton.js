import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { CANDIDATE_PRODUCT_ACTION } from '../../../shared/mutation/candidateProduct'
import { CandidateActionType } from '../../../utils/constants'

const ProductActionButton = ({ product, actionType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const { locale } = useRouter()

  const [candidateProductApproval, { reset }] = useMutation(CANDIDATE_PRODUCT_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateProduct: response } = data
      if (response?.candidateProduct && response?.errors?.length === 0) {
        setLoading(false)
      } else {
        reset()
        setLoading(false)
      }
    },
    onError: () => {
      reset()
      setLoading(false)
    }
  })

  const onClickHandler = async (actionType) => {
    if (user) {
      setLoading(true)
      const { userEmail, userToken } = user
      const variables = {
        slug: product.slug,
        action: actionType === CandidateActionType.REJECT
          ? CandidateActionType.REJECT
          : CandidateActionType.APPROVE
      }

      candidateProductApproval({
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
    <>
      {actionType === CandidateActionType.REJECT && product.rejected === null &&
        <button
          className='bg-red-500 text-white rounded'
          onClick={() => onClickHandler(actionType)}
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
          onClick={() => onClickHandler(actionType)}
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

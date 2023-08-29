import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../../../lib/hooks'
import { CANDIDATE_DATASET_ACTION } from '../../../shared/mutation/candidateDataset'
import { CandidateActionType } from '../../../utils/constants'

const DatasetActionButton = ({ dataset, actionType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const { locale } = useRouter()
  const { user } = useUser()

  const [candidateDatasetApproval, { reset }] = useMutation(CANDIDATE_DATASET_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateDataset: response } = data
      if (response?.candidateDataset && response?.errors?.length === 0) {
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
        slug: dataset.slug,
        action: actionType === CandidateActionType.REJECT
          ? CandidateActionType.REJECT
          : CandidateActionType.APPROVE
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
    <>
      {actionType === CandidateActionType.REJECT && dataset.rejected === null &&
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
      {actionType === CandidateActionType.APPROVE && dataset.rejected === null &&
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

export default DatasetActionButton

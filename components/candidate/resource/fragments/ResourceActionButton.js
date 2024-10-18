import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { CANDIDATE_RESOURCE_ACTION } from '../../../shared/mutation/candidateResource'
import { CandidateActionType } from '../../../utils/constants'

const ResourceActionButton = ({ candidateResource, actionType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const { locale } = useRouter()
  const { user } = useUser()

  const [candidateResourceApproval, { reset }] = useMutation(CANDIDATE_RESOURCE_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateResource: response } = data
      if (response?.candidateResource && response?.errors?.length === 0) {
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
      const variables = {
        slug: candidateResource.slug,
        action: actionType === CandidateActionType.REJECT
          ? CandidateActionType.REJECT
          : CandidateActionType.APPROVE
      }

      candidateResourceApproval({
        variables,
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  return (
    <>
      {actionType === CandidateActionType.REJECT && candidateResource.rejected === null &&
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
      {actionType === CandidateActionType.APPROVE && candidateResource.rejected === null &&
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

export default ResourceActionButton

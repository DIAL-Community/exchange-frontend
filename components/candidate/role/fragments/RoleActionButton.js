import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { CANDIDATE_ROLE_ACTION } from '../../../shared/mutation/candidateRole'
import { CandidateActionType } from '../../../utils/constants'

const RoleActionButton = ({ role, actionType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const { locale } = useRouter()

  const [candidateRoleApproval, { reset }] = useMutation(CANDIDATE_ROLE_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateRole: response } = data
      if (response?.candidateRole && response?.errors?.length === 0) {
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
    setLoading(true)
    const variables = {
      candidateRoleId: role.id,
      action: actionType === CandidateActionType.REJECT
        ? CandidateActionType.REJECT
        : CandidateActionType.APPROVE
    }
    candidateRoleApproval({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  return (
    <>
      {actionType === CandidateActionType.REJECT && role.rejected === null &&
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
      {actionType === CandidateActionType.APPROVE && role.rejected === null &&
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

export default RoleActionButton

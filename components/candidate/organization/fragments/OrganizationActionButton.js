import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { CANDIDATE_ORGANIZATION_ACTION } from '../../../shared/mutation/candidateOrganization'
import { CandidateActionType } from '../../../utils/constants'

const OrganizationActionButton = ({ organization, actionType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const { locale } = useRouter()

  const [candidateOrganizationApproval, { reset }] = useMutation(CANDIDATE_ORGANIZATION_ACTION, {
    onCompleted: (data) => {
      const { approveRejectCandidateOrganization: response } = data
      if (response?.candidateOrganization && response?.errors?.length === 0) {
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
        slug: organization.slug,
        action: actionType === CandidateActionType.REJECT
          ? CandidateActionType.REJECT
          : CandidateActionType.APPROVE
      }

      candidateOrganizationApproval({
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
      {actionType === CandidateActionType.REJECT && organization.rejected === null &&
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
      {actionType === CandidateActionType.APPROVE && organization.rejected === null &&
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

export default OrganizationActionButton

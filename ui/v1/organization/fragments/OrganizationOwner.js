import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useLazyQuery, useMutation } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ToastContext } from '../../../../lib/ToastContext'
import { useOrganizationOwnerUser, useUser } from '../../../../lib/hooks'
import { ObjectType } from '../../utils/constants'
import { CANDIDATE_ROLE_QUERY } from '../../shared/query/candidate'
import { APPLY_AS_OWNER } from '../../shared/mutation/user'

const CONTACT_STATES = ['initial', 'captcha', 'revealed', 'error']

const OrganizationOwner = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, isAdminUser } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization, [], isAdminUser)
  const captchaRef = useRef()
  const { locale } = useRouter()

  const [contactState, setContactState] = useState(CONTACT_STATES[0])
  const [emailAddress, setEmailAddress] = useState('')

  const [loading, setLoading] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const { showToast } = useContext(ToastContext)

  const [fetchCandidateRole, { data, error }] = useLazyQuery(CANDIDATE_ROLE_QUERY)
  useEffect(() => {
    if (user) {
      const { userEmail } = user
      fetchCandidateRole({
        variables: {
          email: userEmail,
          organizationId: organization.id,
          organizationId: '',
          datasetId: ''
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const displayApplyOwnershipLink = (user) => {
    if (!user || isOrganizationOwner) {
      return false
    }

    return data?.candidateRole === null || data?.candidateRole?.rejected
  }

  const staticOwnershipTextSelection = (user) => {
    if (!user) {
      // Not logged in, don't display anything.
      return ''
    }

    if (isOrganizationOwner) {
      return 'owner'
    }

    if (data?.candidateRole?.rejected === null) {
      // Applying to be the owner of the organization
      return 'applied-to-own'
    }
  }

  useEffect(() => {
    setShowApplyLink(displayApplyOwnershipLink(user))
    setOwnershipText(staticOwnershipTextSelection(user))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error, data])

  const updateContactInfo = async (captchaValue) => {
    const { userEmail, userToken } = user
    const requestBody = {
      user_email: userEmail,
      user_token: userToken,
      captcha: captchaValue,
      organization: organization.slug
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILS_SERVER}/api/v1/organizations/owners`,
      {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_RAILS_SERVER,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Set-Cookie'
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (response) {
      setContactState(CONTACT_STATES[2])
      if (response.status === 200) {
        const ownerData = await response.json()
        const [ownerInformation] = ownerData.owner
        setEmailAddress(ownerInformation.email)
      } else {
        setContactState(CONTACT_STATES[3])
      }
    }
  }

  const [applyAsOwner, { reset }] = useMutation(APPLY_AS_OWNER, {
    refetchQueries: ['CandidateRole'],
    onCompleted: (data) => {
      const { applyAsOwner: response } = data
      if (!response?.candidateRole || response?.errors?.length > 0) {
        showToast(data.applyAsOwner.errors[0], 'error', 'top-center')
        setLoading(false)
        reset()
      } else {
        showToast(
          format('toast.applyAsOwner.submit.success', { entity: format('organization.label') }),
          'success',
          'top-center'
        )
        setLoading(false)
      }
    },
    onError: (error) => {
      showToast(error?.message, 'error', 'top-center')
      setLoading(false)
      reset()
    }
  })

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user
      setLoading(true)

      applyAsOwner({
        variables: {
          entity: ObjectType.ORGANIZATION,
          entityId: parseInt(organization.id)
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
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xs'>{format('organization.owner')}</div>
      <div className='flex text-xs text-dial-stratos'>
        <a
          href={`https://docs.dial.community/projects/organization-registry/${locale}/latest/organization_owner.html`}
          target='_blank'
          rel='noreferrer'
        >
          <div className='border-b border-dial-iris-blue'>{format('organization.ownerLink')} ⧉</div>
        </a>
      </div>
      {showApplyLink && (
        <div className='flex text-xs text-dial-stratos'>
          <button
            className='border-b border-dial-iris-blue'
            onClick={onSubmit}
            disabled={loading}
          >
            {format('ownership.apply')}
            {loading && <FaSpinner className='inline spinner mx-1' />}
          </button>
        </div>
      )}
      {ownershipText && (
        <div className='text-xs text-dial-plum font-semibold'>
          {ownershipText === 'owner' ? format('ownership.owned') : format('ownership.applied')}
        </div>
      )}
      {user && organization.owner && (
        <div className='flex text-xs text-dial-plum font-semibold'>
          {contactState === CONTACT_STATES[0] &&
            <button
              className='border-b border-dial-iris-blue'
              onClick={() => setContactState(CONTACT_STATES[1])}
            >
              {format('organization.owner.revealContact')}
            </button>
          }
          {contactState === CONTACT_STATES[1] && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
              onChange={updateContactInfo}
              ref={captchaRef}
            />
          )}
          {contactState === CONTACT_STATES[2] && (
            <div className='flex gap-1'>
              {format('organization.owner.contactLabel')}:
              <a
                className='border-b border-dial-iris-blue'
                href={`mailto:${emailAddress}`}
                target='_blank'
                rel='noreferrer'
              >
                {emailAddress}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrganizationOwner

import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { useCallback, useContext, useRef, useState } from 'react'
import { ToastContext } from '../../../../lib/ToastContext'
import { useOrganizationOwnerUser, useUser } from '../../../../lib/hooks'
import { ObjectType } from '../../utils/constants'
import { CANDIDATE_ROLE_QUERY } from '../../shared/query/candidateRole'
import { APPLY_AS_OWNER } from '../../shared/mutation/user'
import { ORGANIZATION_CONTACT_QUERY } from '../../shared/query/organization'

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

  useQuery(CANDIDATE_ROLE_QUERY, {
    variables: {
      email: user?.userEmail,
      organizationId: organization.id
    },
    skip: !user || !user.userEmail,
    onCompleted: (data) => {
      const { candidateRole } = data
      const showApplyLink = candidateRole === null || candidateRole?.rejected
      setShowApplyLink(showApplyLink)

      if (isOrganizationOwner) {
        return setOwnershipText('owner')
      }

      if (candidateRole?.rejected === null) {
        // Applying to be the owner of the organization
        setOwnershipText('applied-to-own')
      }
    }
  })

  const [revealContact] = useLazyQuery(ORGANIZATION_CONTACT_QUERY, {
    onCompleted: (data) => {
      const [firstOwner] = data.owners
      setEmailAddress(firstOwner.email)
      setContactState(CONTACT_STATES[2])
    },
    onError: () => {
      setContactState(CONTACT_STATES[3])
    }
  })

  const updateContactInfo = async (captchaValue) => {
    const { userEmail, userToken } = user
    revealContact({
      variables: {
        slug: organization.slug,
        type: ObjectType.ORGANIZATION,
        captcha: captchaValue
      },
      context: {
        headers: {
          'Accept-Language': locale,
          Authorization: `${userEmail} ${userToken}`
        }
      }
    })
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
      <div className='flex gap-3 text-xs text-dial-stratos'>
        <a
          href={`https://docs.dial.community/projects/organization-registry/${locale}/latest/organization_owner.html`}
          target='_blank'
          rel='noreferrer'
        >
          <div className='border-b border-dial-iris-blue'>{format('organization.ownerLink')} ⧉</div>
        </a>
        {showApplyLink && (
          <>
            <div className='border-r border-dial-slate-400' />
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
          </>
        )}
        {ownershipText && (
          <>
            <div className='border-r border-dial-slate-400' />
            <div className='text-xs text-dial-plum font-semibold'>
              {ownershipText === 'owner' ? format('ownership.owned') : format('ownership.applied')}
            </div>
          </>
        )}
      </div>
      {user && organization.haveOwner && (
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
            <div className='flex gap-2'>
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

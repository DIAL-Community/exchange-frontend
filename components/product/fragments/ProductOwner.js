import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { useCallback, useContext, useRef, useState } from 'react'
import { ToastContext } from '../../../../lib/ToastContext'
import { useProductOwnerUser, useUser } from '../../../../lib/hooks'
import { ObjectType } from '../../utils/constants'
import { OWNER_CANDIDATE_ROLE_DETAIL_QUERY } from '../../shared/query/candidateRole'
import { APPLY_AS_OWNER } from '../../shared/mutation/user'
import { PRODUCT_CONTACT_QUERY } from '../../shared/query/product'

const CONTACT_STATES = ['initial', 'captcha', 'revealed', 'error']

const ProductOwner = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, isAdminUser } = useUser()
  const { isProductOwner } = useProductOwnerUser(product, [], isAdminUser)
  const captchaRef = useRef()
  const { locale } = useRouter()

  const [contactState, setContactState] = useState(CONTACT_STATES[0])
  const [emailAddress, setEmailAddress] = useState('')

  const [loading, setLoading] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  useQuery(OWNER_CANDIDATE_ROLE_DETAIL_QUERY, {
    variables: {
      email: user?.userEmail,
      productId: product.id
    },
    skip: !user || !user.userEmail,
    onCompleted: (data) => {
      const { candidateRole } = data
      const showApplyLink = candidateRole === null || candidateRole?.rejected
      setShowApplyLink(showApplyLink)

      if (isProductOwner) {
        return setOwnershipText('owner')
      }

      if (candidateRole?.rejected === null) {
        // Applying to be the owner of the organization
        setOwnershipText('applied-to-own')
      }
    }
  })

  const [revealContact] = useLazyQuery(PRODUCT_CONTACT_QUERY, {
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
        slug: product.slug,
        type: ObjectType.PRODUCT,
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
        showFailureMessage(data.applyAsOwner.errors[0])
        setLoading(false)
        reset()
      } else {
        showSuccessMessage(format('toast.applyAsOwner.submit.success', { entity: format('ui.product.label') }))
        // Applying to be the owner of the organization
        setShowApplyLink(!showApplyLink)
        setOwnershipText('applied-to-own')
        setLoading(false)
      }
    },
    onError: (error) => {
      showFailureMessage(error?.message)
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
          entity: ObjectType.PRODUCT,
          entityId: parseInt(product.id)
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

  const ownerInformation = 'https://docs.dial.community/projects/product-registry/' +
    `${locale}/latest/product_owner.html`

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xs'>{format('product.owner')}</div>
      <div className='flex flex-col gap-3 text-xs text-dial-stratos'>
        <a href={ownerInformation} target='_blank' rel='noreferrer' className='flex'>
          <div className='border-b border-dial-iris-blue'>
            {format('product.ownerLink')}
            &nbsp;⧉
          </div>
        </a>
        {showApplyLink && (
          <div className='flex text-xs text-dial-stratos'>
            <a
              href='#'
              className='border-b border-dial-iris-blue'
              onClick={onSubmit}
              disabled={loading}
            >
              {format('ownership.apply')}
              {loading && <FaSpinner className='inline spinner mx-1' />}
            </a>
          </div>
        )}
        {ownershipText && (
          <div className='text-xs text-dial-meadow font-semibold'>
            {ownershipText === 'owner' ? format('ownership.owned') : format('ownership.applied')}
          </div>
        )}
      </div>
      {user && product.haveOwner && (
        <div className='flex text-xs text-dial-meadow font-semibold'>
          {contactState === CONTACT_STATES[0] &&
            <a
              href='#'
              className='border-b border-dial-iris-blue'
              onClick={() => setContactState(CONTACT_STATES[1])}
            >
              {format('product.owner.revealContact')}
            </a>
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
              {format('product.owner.contactLabel')}:
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

export default ProductOwner

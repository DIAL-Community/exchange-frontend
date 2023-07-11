import { useLazyQuery, useMutation } from '@apollo/client'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { useProductOwnerUser, useUser } from '../../lib/hooks'
import CommentsCount from '../shared/CommentsCount'
import { ObjectType } from '../../lib/constants'
import { APPLY_AS_OWNER } from '../../mutations/users'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { CANDIDATE_ROLE_QUERY } from '../../queries/candidate'
import DeleteProduct from './DeleteProduct'

const CONTACT_STATES = ['initial', 'captcha', 'revealed', 'error']

const ProductDetailLeft = ({ product, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user, isAdminUser, loadingUserSession } = useUser()
  const { isProductOwner } = useProductOwnerUser(product, [], loadingUserSession || isAdminUser)

  const captchaRef = useRef()
  const [contactState, setContactState] = useState(CONTACT_STATES[0])
  const [emailAddress, setEmailAddress] = useState('')

  const [loading, setLoading] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/${locale}/products/${product.slug}/edit`
  }

  const [fetchCandidateRole, { data, error }] = useLazyQuery(CANDIDATE_ROLE_QUERY)
  useEffect(() => {
    if (user) {
      const { userEmail } = user
      fetchCandidateRole({
        variables: {
          email: userEmail,
          productId: product.id,
          organizationId: '',
          datasetId: ''
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const displayApplyOwnershipLink = (user) => {
    if (!user) {
      // Not logged in, don't display the link.
      return false
    }

    if (isProductOwner) {
      return false
    }

    if (data?.candidateRole === null || data?.candidateRole?.rejected) {
      return true
    }
  }

  const staticOwnershipTextSelection = (user) => {
    if (!user) {
      // Not logged in, don't display anything.
      return ''
    }

    if (isProductOwner) {
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
      product: product.slug
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILS_SERVER}/api/v1/products/owners`,
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
        showToast(
          <div className='flex flex-col'>
            <span>{data.applyAsOwner.errors[0]}</span>
          </div>,
          'error',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => setLoading(false)
        )
        reset()
      } else {
        showToast(
          format('toast.applyAsOwner.submit.success', { entity: format('product.label') }),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => setLoading(false)
        )
      }
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => setLoading(false)
      )
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

  const slugNameMapping = (() => {
    const map = {}
    map[product.slug] = product.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full inline-flex gap-3'>
          {(isAdminUser || isProductOwner) && <EditButton type='link' href={generateEditLink()} />}
          {isAdminUser && <DeleteProduct product={product} />}
          <CommentsCount commentsSectionRef={commentsSectionRef} objectId={product.id} objectType={ObjectType.PRODUCT}/>
        </div>
        <div className='h4 font-bold py-4'>{format('products.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 shadow-lg'>
        <div id='header' className='flex flex-col h-80 p-2'>
          <div className='h1 p-2 text-dial-purple'>
            {product.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative' >
            <Image
              fill
              className='p-2 m-auto object-contain'
              alt={`${product.name} Logo`}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
            />
          </div>
        </div>
        <div className='fr-view text-dial-gray-dark line-clamp-5'>
          {product.productDescription && parse(product.productDescription.description)}
        </div>
      </div>
      <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 shadow-lg border-b-2 border-dial-gray'>
        {format('product.owner')}
        <div className='flex flex-row gap-3'>
          <a
            className='text-dial-sunshine block mt-2 border-b border-transparent hover:border-dial-sunshine'
            target='_blank' rel='noreferrer'
            href={`https://docs.dial.community/projects/product-registry/${locale}/latest/product_owner.html`}
          >
            {format('product.owner-link')}
          </a>
          {
            showApplyLink &&
              <>
                <div className='border-l border-dial-gray-light mt-2' />
                <button
                  className='text-dial-sunshine block mt-2 border-b border-transparent hover:border-dial-sunshine'
                  onClick={onSubmit}
                  disabled={loading}
                >
                  {format('ownership.apply')}
                  {loading && <FaSpinner className='inline spinner ml-1' />}
                </button>
              </>
          }
          {
            ownershipText &&
              <>
                <div className='border-l border-dial-gray-light mt-2' />
                <div className='text-dial-gray-light block mt-2'>
                  {ownershipText === 'owner' ? format('ownership.owned') : format('ownership.applied')}
                </div>
              </>
          }
        </div>
        {
          user && product.owner && contactState === CONTACT_STATES[0] &&
            <>
              <div className='border-l border-dial-gray-light mt-2' />
              <button
                className='text-dial-sunshine block mt-2 border-b border-transparent hover:border-dial-sunshine'
                onClick={() => setContactState(CONTACT_STATES[1])}
              >
                {format('ownership.reveal')}
              </button>
            </>
        }
        {
          user && product.owner &&
            <>
              {contactState === CONTACT_STATES[1] &&
                <div className='mt-2'>
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                    onChange={updateContactInfo} ref={captchaRef}
                  />
                </div>
              }
              {
                contactState === CONTACT_STATES[2] &&
                  <div className='mt-2'>
                    {format('ownership.label')}:
                    <a
                      className='text-dial-sunshine mx-2 mt-2 border-b border-transparent hover:border-dial-sunshine'
                      href={`mailto:${emailAddress}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {emailAddress}
                    </a>
                  </div>
              }

            </>
        }
      </div>
    </>
  )
}

export default ProductDetailLeft

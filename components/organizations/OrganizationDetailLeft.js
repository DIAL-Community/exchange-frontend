import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { FaSpinner } from 'react-icons/fa'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { ObjectType } from '../../lib/constants'
import CommentsCount from '../shared/CommentsCount'
import { APPLY_AS_OWNER } from '../../mutations/users'
import { ToastContext } from '../../lib/ToastContext'
import { useOrganizationOwnerUser, useUser } from '../../lib/hooks'
import { CANDIDATE_ROLE_QUERY } from '../../queries/candidate'
import DeleteOrganization from './DeleteOrganization'

const OrganizationDetailLeft = ({ organization, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { showToast } = useContext(ToastContext)

  const { locale } = useRouter()

  const { user, isAdminUser } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)

  const [loading, setLoading] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/${locale}/organizations/${organization.slug}/edit`
  }

  const [fetchCandidateRole, { data, error }] = useLazyQuery(CANDIDATE_ROLE_QUERY)
  useEffect(() => {
    if (user) {
      const { userEmail } = user
      fetchCandidateRole({
        variables: {
          email: userEmail,
          productId: '',
          datasetId: '',
          organizationId: organization.id
        }
      })
    }
  }, [user])

  const displayApplyOwnershipLink = (user) => {
    if (!user) {
      // Not logged in, don't display the link.
      return false
    }

    if (isOrganizationOwner) {
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

    if (isOrganizationOwner) {
      // Already owning this organization, display user already owning.
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
  }, [user, data, error])

  const [applyAsOwner, { reset }] = useMutation(APPLY_AS_OWNER, {
    refetchQueries: ['CandidateRole'],
    onCompleted: (data) => {
      const { applyAsOwner: response } = data
      if (response?.candidateRole && response?.errors?.length === 0) {
        showToast(
          format('toast.applyAsOwner.submit.success', { entity: format('organization.label') }),
          'success',
          'top-center',
          null,
          () => setLoading(false)
        )
      } else {
        showToast(
          <div className='flex flex-col'>
            <span>{data.applyAsOwner.errors[0]}</span>
          </div>,
          'error',
          'top-center',
          null,
          () => setLoading(false)
        )
        reset()
      }
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center',
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

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full inline-flex gap-3'>
          {isAdminUser && <DeleteOrganization organization={organization} />}
          {(isOrganizationOwner || isAdminUser) && <EditButton type='link' href={generateEditLink()}/>}
          <CommentsCount
            commentsSectionRef={commentsSectionRef}
            objectId={organization.id}
            objectType={ObjectType.ORGANIZATION}
          />
        </div>
        <div className='h4 font-bold py-4'>{format('organization.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray lg:mr-6 shadow-lg'>
        {
          organization.whenEndorsed && (
            <div className='flex flex-row p-1.5 border-b border-dial-gray text-xs font-semibold text-dial-cyan'>
              <img
                alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                className='mr-2 h-6' src='/icons/digiprins/digiprins.png'
              />
              <div className='my-auto'>
                {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
              </div>
            </div>
          )
        }
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold w-4/5 md:w-auto lg:w-64 2xl:w-80 text-dial-purple overflow-hidden'>
            {organization.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative' >
            <Image
              layout='fill'
              objectFit='contain'
              className='w-40'
              alt={format('image.alt.logoFor', { name: organization.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
            />
          </div>
        </div>
      </div>
      <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 lg:mr-6 shadow-lg border-b-2 border-dial-gray'>
        {format('organization.owner')}
        <div className='flex flex-row gap-3'>
          <a
            className='text-dial-yellow block mt-2'
            href={`https://docs.osc.dial.community/projects/product-registry/${locale}/latest/org_owner.html`}
            target='_blank' rel='noreferrer'
          >
            {format('organization.owner-link')}
          </a>
          {
            showApplyLink &&
              <>
                <div className='border-l border-dial-gray-light mt-2' />
                <button
                  className='text-dial-yellow block mt-2 border-b border-transparent hover:border-dial-yellow'
                  onClick={onSubmit} disabled={loading}
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
      </div>
    </>
  )
}

export default OrganizationDetailLeft

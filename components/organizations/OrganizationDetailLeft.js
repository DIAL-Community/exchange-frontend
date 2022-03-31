/* global fetch:false */

import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { FaSpinner } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import Breadcrumb from '../shared/breadcrumb'

const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole($email: String!, $productId: String!, $organizationId: String!) {
    candidateRole(email: $email, productId: $productId, organizationId: $organizationId) {
      id
      productId
      organizationId
    }
  }
`

const OrganizationDetailLeft = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [session] = useSession()
  const { locale } = useRouter()

  const [loading, setLoading] = useState(false)
  const [appliedToBeOwner, setAppliedToBeOwner] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user

    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/organizations/${organization.slug}/` +
      `edit?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

  const [fetchCandidateRole, { data, error }] = useLazyQuery(CANDIDATE_ROLE_QUERY)
  useEffect(() => {
    if (session && session.user) {
      const { userEmail } = session.user
      fetchCandidateRole({
        variables:
          { email: userEmail, productId: '', organizationId: organization.id }
      })
    }
  }, [session])

  const displayApplyOwnershipLink = (session, error, appliedToBeOwner) => {
    if (!session || !session.user) {
      // Not logged in, don't display the link.
      return false
    }

    const user = session.user
    if (`${user.own.organization}` === `${organization.id}`) {
      // Already owning this organization, don't display the link.
      return false
    }

    if (!appliedToBeOwner && error) {
      // Have not apply to be one or if searching in the db return no data.
      return true
    }

    return false
  }

  const staticOwnershipTextSelection = (session, data, appliedToBeOwner) => {
    if (!session || !session.user) {
      // Not logged in, don't display anything.
      return ''
    }

    const user = session.user
    if (`${user.own.organization}` === `${organization.id}`) {
      // Already owning this organization, display user already owning.
      return 'owner'
    }

    if (appliedToBeOwner || (data && `${data.candidateRole?.organizationId}` === `${organization.id}`)) {
      // Applying to be the owner of the organization
      return 'applied-to-own'
    }
  }

  useEffect(() => {
    setShowApplyLink(displayApplyOwnershipLink(session, error, appliedToBeOwner))
    setOwnershipText(staticOwnershipTextSelection(session, data, appliedToBeOwner))
  }, [session, data, error, appliedToBeOwner])

  const applyToBeOrganizationOwner = async () => {
    setLoading(true)
    const { userEmail, userToken } = session.user
    const requestBody = {
      candidate_role: {
        email: userEmail,
        description: 'Organization ownership requested from the new UX.',
        organization_id: organization.id
      },
      user_email: userEmail,
      user_token: userToken
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_roles`,
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
      setLoading(false)
      setAppliedToBeOwner(response.status === 201)
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
        <div className='w-full'>
          {
            session && (
              <div className='inline'>
                {
                  (session.user.canEdit || `${session.user.own.organization}` === `${organization.id}`) && (
                    <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                      <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                      <span className='text-sm px-2'>{format('app.edit')}</span>
                    </a>
                  )
                }
              </div>
            )
          }
          <img src='/icons/comment.svg' className='inline mr-2' alt='Edit' height='15px' width='15px' />
          <div className='text-dial-blue inline'>{format('app.comment')}</div>
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
          <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 text-dial-purple'>
            {organization.name}
          </div>
          <div className='m-auto align-middle w-40'>
            <img
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
                  href='/apply-product-owner' onClick={applyToBeOrganizationOwner} disabled={loading}
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

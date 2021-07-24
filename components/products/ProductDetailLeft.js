/* global fetch:false */

import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'
import { DiscourseCount } from '../shared/discourse'
import Breadcrumb from '../shared/breadcrumb'
import { useRouter } from 'next/router'

import { descriptionByLocale } from '../../lib/utilities'
import gql from 'graphql-tag'

import { FaSpinner } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'

const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole($email: String!, $productId: String!, $organizationId: String!) {
    candidateRole(email: $email, productId: $productId, organizationId: $organizationId) {
      id
      productId
      organizationId
    }
  }
`

const ProductDetailLeft = ({ product, discourseClick }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [session] = useSession()
  const router = useRouter()
  const { locale } = router

  const [loading, setLoading] = useState(false)
  const [appliedToBeOwner, setAppliedToBeOwner] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user
    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/products/${product.slug}/` +
        `edit?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

  const [fetchCandidateRole, { data, error }] = useLazyQuery(CANDIDATE_ROLE_QUERY)
  useEffect(() => {
    if (session && session.user) {
      fetchCandidateRole({
        variables:
          { email: session.user.userEmail, productId: product.id, organizationId: '' }
      })
    }
  }, [session])

  const displayApplyOwnershipLink = (session, error, appliedToBeOwner) => {
    if (!session || !session.user) {
      // Not logged in, don't display the link.
      return false
    }

    const user = session.user
    const filteredProducts = user.own && user.own.products.filter(item => {
      return `${item}` === `${product.id}`
    })

    if (filteredProducts && filteredProducts.length > 0) {
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
    const filteredProducts = user.own && user.own.products.filter(item => {
      return `${item}` === `${product.id}`
    })

    if (filteredProducts && filteredProducts.length > 0) {
      return 'owner'
    }

    if (appliedToBeOwner || (data && `${data.candidateRole.productId}` === `${product.id}`)) {
      // Applying to be the owner of the organization
      return 'applied-to-own'
    }
  }

  useEffect(() => {
    setShowApplyLink(displayApplyOwnershipLink(session, error, appliedToBeOwner))
    setOwnershipText(staticOwnershipTextSelection(session, data, appliedToBeOwner))
  }, [session, data, error, appliedToBeOwner])

  const applyToBeProductOwner = async () => {
    setLoading(true)
    const { userEmail, userToken } = session.user
    const requestBody = {
      candidate_role: {
        email: userEmail,
        description: 'Product ownership requested from the new UX.',
        product_id: product.id
      },
      user_email: userEmail,
      user_token: userToken
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVER}/candidate_roles`,
      {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
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
    map[product.slug] = product.name
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
                  (session.user.canEdit || session.user.own.products.filter(p => `${p}` === `${product.id}`).length > 0) && (
                    <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                      <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                      <span className='text-sm px-2'>{format('app.edit')}</span>
                    </a>
                  )
                }
              </div>
            )
          }
          <button onClick={discourseClick}><DiscourseCount /></button>
        </div>
        <div className='h4 font-bold py-4'>{format('products.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h1 p-2 text-dial-purple'>
            {product.name}
          </div>
          <img alt={`${product.name} Logo`} className='p-2 m-auto' src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile} width='200px' height='200px' />
        </div>
        <div className='fr-view text-dial-gray-dark'>
          {ReactHtmlParser(descriptionByLocale(product.productDescriptions, locale))}
        </div>
      </div>
      <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 lg:mr-6 shadow-lg border-b-2 border-dial-gray'>
        {format('product.owner')}
        <div className='flex flex-row gap-3'>
          <a
            className='text-dial-yellow block mt-2 border-b border-transparent hover:border-dial-yellow'
            target='_blank' rel='noreferrer'
            href='https://docs.osc.dial.community/projects/product-registry/en/latest/product_owner.html'
          >
            {format('product.owner-link')}
          </a>
          {
            showApplyLink &&
              <>
                <div className='border-l border-dial-gray-light mt-2' />
                <button
                  className='text-dial-yellow block mt-2 border-b border-transparent hover:border-dial-yellow'
                  href='/apply-product-owner' onClick={applyToBeProductOwner} disabled={loading}
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

export default ProductDetailLeft

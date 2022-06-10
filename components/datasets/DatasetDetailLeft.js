/* global fetch:false */

import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { FaSpinner } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { DiscourseCount } from '../shared/discourse'
import Breadcrumb from '../shared/breadcrumb'

const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole($email: String!, $datasetId: String!, $organizationId: String!) {
    candidateRole(email: $email, datasetId: $datasetId, organizationId: $organizationId) {
      id
      datasetId
      organizationId
    }
  }
`

const CONTACT_STATES = ['initial', 'captcha', 'revealed', 'error']

const DatasetDetailLeft = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [session] = useSession()
  const router = useRouter()
  const { locale } = router

  const generateEditLink = () => {
    if (!session) {
      return '/edit-not-available'
    }

    return `/${locale}/datasets/${dataset.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[dataset.slug] = dataset.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full'>
          {session && (
            <div className='inline'>
              {session.user.canEdit && (
                <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                  <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                  <span className='text-sm px-2'>{format('app.edit')}</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className='h4 font-bold py-4'>{format('datasets.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h1 p-2 text-dial-purple'>
            {dataset.name}
          </div>
          <img
            alt={`${dataset.name} Logo`} className='p-2 m-auto'
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
            width='200px' height='200px'
          />
        </div>
        <div className='fr-view text-dial-gray-dark max-h-40 overflow-hidden'>
          {dataset.datasetDescription && parse(dataset.datasetDescription.description)}
        </div>
      </div>
    </>
  )
}

export default DatasetDetailLeft

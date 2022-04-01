/* global IntersectionObserver: false */

import { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import { gql, useQuery } from '@apollo/client'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import { Error, Loading } from '../shared/FetchStatus'
import { PlaybookDetailDispatchContext } from './PlaybookDetailContext'

const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      playbookDescription {
        id
        overview
        audience
        outcomes
      }
    }
  }
`

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const PlaybookDetailOverview = ({ slug, locale }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [session] = useSession()
  const [height, setHeight] = useState(0)
  const { updateSlugInformation } = useContext(PlaybookDetailDispatchContext)

  const ref = useRef()

  const { loading, error, data, refetch } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [locale])

  useEffect(() => {
    // Update context for this overview. We're using fake slug data for this.
    updateSlugInformation(OVERVIEW_SLUG_NAME, 0, height)
  }, [height])

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const observerCallback = ([observerData]) => {
      if (!observerData || !observerData.boundingClientRect) {
        // Skip if we don't have observer data ready yet.
        return
      }

      setHeight(observerData.boundingClientRect.height)
    }

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-150px 0px 0px 0px'
    })

    observer.observe(ref.current)

    // Remove the observer as soon as the component is unmounted.
    return () => { observer.disconnect() }
  }, [ref.current])

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${slug}/edit`
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const slugNameMapping = (() => {
    return { [[data.playbook.slug]]: data.playbook.name }
  })()

  return (
    <div className='flex flex-col gap-3 px-3' ref={ref}>
      <div className='flex'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='mt-4 ml-auto'>
          {
            session?.user.canEdit && (
              <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                <span className='text-sm px-2'>{format('app.edit')}</span>
              </a>
            )
          }
        </div>
      </div>
      <div className='h4'>{format('playbooks.overview')}</div>
      <div className='fr-view tiny-editor text-dial-gray-dark'>
        {parse(data.playbook.playbookDescription.overview)}
      </div>
      <div className='h4'>{format('playbooks.audience')}</div>
      <div className='fr-view tiny-editor text-dial-gray-dark'>
        {parse(data.playbook.playbookDescription.audience)}
      </div>
      <div className='h4'>{format('playbooks.outcomes')}</div>
      <div className='fr-view tiny-editor text-dial-gray-dark'>
        {parse(data.playbook.playbookDescription.outcomes)}
      </div>
    </div>
  )
}

export default PlaybookDetailOverview

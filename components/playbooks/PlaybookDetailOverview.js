import { createRef, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import parse from 'html-react-parser'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import PlaybookDetailMenu from './PlaybookDetailMenu'
import { PlaybookDetailDispatchContext } from './PlaybookDetailContext'

export const PLAYBOOK_QUERY = gql`
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

const PlaybookDetailOverview = ({ slug, locale, allowEmbedCreation }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [height, setHeight] = useState(0)
  const { updateSlugInformation } = useContext(PlaybookDetailDispatchContext)

  const ref = createRef()

  const { loading, error, data, refetch } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  useEffect(() => {
    // Update context for this overview. We're using fake slug data for this.
    updateSlugInformation(OVERVIEW_SLUG_NAME, 0, height)
  }, [height])

  useEffect(() => {
    // Update scrolling state information based on the observer data.
    if (!ref.current) {
      return
    }

    const boundingClientRect = ref.current.getBoundingClientRect()
    setHeight(boundingClientRect.height)
  }, [ref])

  // Loading and error handler section.
  if (loading) {
    return <Loading />
  } else if (error) {
    if (error.networkError) {
      return <Error />
    } else {
      return <NotFound />
    }
  }

  return (
    <div className='flex flex-col gap-3 px-3' ref={ref}>
      <PlaybookDetailMenu playbook={data.playbook} locale={locale} allowEmbedCreation={allowEmbedCreation} />
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

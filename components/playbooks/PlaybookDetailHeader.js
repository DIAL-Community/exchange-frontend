import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { useContext, useEffect, useState } from 'react'
import { PlaybookDetailContext } from './PlaybookDetailContext'
import { Error, Loading } from '../shared/FetchStatus'
import { OVERVIEW_SLUG_NAME } from './PlaybookDetailOverview'

const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      imageFile
      playbookPlays {
        playSlug
        order
      }
    }
  }
`

const PlaybookDetailHeader = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [percentage, setPercentage] = useState(0)
  const [currentSlugIndex, setCurrentSlugIndex] = useState(-1)
  const { currentSlug, slugHeights, slugIntersectionRatios } = useContext(PlaybookDetailContext)

  const { loading, error, data } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug: slug }
  })

  useEffect(() => {
    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)
    const barSegmentMultiplier = 100 / (playSlugs.length - 1)

    setPercentage(barSegmentMultiplier * currentSlugIndex)
  }, [currentSlugIndex, slugIntersectionRatios])

  useEffect(() => {
    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)
    setCurrentSlugIndex(playSlugs.indexOf(currentSlug))
  }, [currentSlug])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const navigateToPlay = (e, slug) => {
    e.preventDefault()
    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)

    let index = 0
    let height = slugHeights[OVERVIEW_SLUG_NAME]
    while (index < playSlugs.length && playSlugs[index] !== slug) {
      height = height + slugHeights[playSlugs[index]]
      index = index + 1
    }

    window.scrollTo({
      top: height,
      behavior: 'smooth'
    })
  }

  return (
    <div className='bg-dial-yellow sticky sticky-under-header'>
      <div className='flex flex-wrap gap-3'>
        <div className='px-8 py-3 flex flex-col gap-1'>
          <div className='text-sm'>
            <img
              data-tip={format('tooltip.forEntity', { entity: format('playbooks.label'), name: data.playbook.name })}
              alt={format('image.alt.logoFor', { name: data.playbook.name })} className='m-auto h-6 inline mr-2 playbook-filter'
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.playbook.imageFile}
            />
            {format('playbooks.label')}
          </div>
          <div className='text-2xl font-semibold'>{data.playbook.name}</div>
        </div>
        <div className='lg:ml-auto px-8 lg:px-4 pb-3 lg:pb-0 my-auto'>
          <div className='play-progress'>
            <div className='play-progress-bar' style={{ width: `${percentage}%` }} />
            <div className='play-progress-bar-base' />
            <div className='play-progress-number'>
              {
                data.playbook.playbookPlays.map((playbookPlay, index) => {
                  return (
                    <div key={playbookPlay.order}>
                      <a href='#navigate-to-play' onClick={(e) => navigateToPlay(e, playbookPlay.playSlug)}>
                        <div className={`step ${index <= currentSlugIndex && 'active'}`}>
                          {playbookPlay.order + 1}
                        </div>
                      </a>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetailHeader

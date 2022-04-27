import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { useContext, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Error, Loading } from '../shared/FetchStatus'
import { PlaybookDetailContext } from './PlaybookDetailContext'
import { OVERVIEW_SLUG_NAME } from './PlaybookDetailOverview'

export const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      imageFile
      playbookPlays {
        id
        playSlug
        order
      }
    }
  }
`

const PlaybookDetailHeader = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const playProgressNumbersRef = useRef([])
  const [percentage, setPercentage] = useState(0)
  const [currentSlugIndex, setCurrentSlugIndex] = useState(-1)
  const { currentSlug, slugHeights, slugIntersectionRatios } = useContext(PlaybookDetailContext)

  const { loading, error, data } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug: slug }
  })

  useEffect(() => {
    playProgressNumbersRef.current = playProgressNumbersRef.current.slice(0, data?.playbook?.playbookPlays?.length)
  }, [data])

  useEffect(() => {
    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)
    const barSegmentMultiplier = 100 / (playSlugs.length - 1)

    setPercentage(barSegmentMultiplier * currentSlugIndex)
  }, [currentSlugIndex, slugIntersectionRatios, data])

  useEffect(() => {
    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)
    const playIndex = playSlugs.indexOf(currentSlug)

    // Scroll into the current play if play progress bar is scrollable
    playProgressNumbersRef.current[playIndex]?.scrollIntoView({ block: 'nearest' })

    setCurrentSlugIndex(playIndex)
  }, [currentSlug, setCurrentSlugIndex, data])

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
            <Link href='/playbooks'>
              <a href='back-to-playbooks'>
                <img
                  data-tip={format('tooltip.forEntity', { entity: format('playbooks.label'), name: data.playbook.name })}
                  className='m-auto h-6 inline mr-2'
                  alt={format('image.alt.logoFor', { name: data.playbook.name })}
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.playbook.imageFile}
                />
                {format('playbooks.label')}
              </a>
            </Link>
          </div>
          <div className='text-2xl font-semibold'>{data.playbook.name}</div>
        </div>
        <div className='flex lg:ml-auto px-8 lg:px-4 pb-3 lg:pb-0 my-auto overflow-x-auto'>
          <div className='play-progress'>
            <div className='play-progress-bar' style={{ width: `${percentage}%` }} />
            <div className='play-progress-bar-base' />
            <div className='play-progress-number'>
              {
                data.playbook.playbookPlays.map((playbookPlay, index) => {
                  return (
                    <a
                      key={index}
                      ref={playProgressNumber => playProgressNumbersRef.current[index] = playProgressNumber}
                      href='#navigate-to-play'
                      onClick={(e) => navigateToPlay(e, playbookPlay.playSlug)}
                    >
                      <div className={`step ${index <= currentSlugIndex && 'active'}`}>
                        {index + 1}
                      </div>
                    </a>
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

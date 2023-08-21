import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import Breadcrumb from '../../shared/Breadcrumb'
import { PlaybookDetailContext, PlaybookDetailDispatchContext } from '../context/PlaybookDetailContext'
import { OVERVIEW_SLUG_NAME } from './PlaybookDetailOverview'

const PlaybookDetailHeader = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()

  const [percentage, setPercentage] = useState(0)
  const [currentSlugIndex, setCurrentSlugIndex] = useState(-1)

  const { currentSlug, slugHeights } = useContext(PlaybookDetailContext)
  const { setCurrentSlug } = useContext(PlaybookDetailDispatchContext)

  const isPlaybookPublished = !playbook?.draft

  useEffect(() => {
    if (playbook) {
      const playSlugs = playbook.playbookPlays.map(play => play.playSlug)
      const barSegmentMultiplier = 100 / (playSlugs.length - 1)
      const currentSlugIndex = playSlugs.indexOf(currentSlug)

      setCurrentSlugIndex(currentSlugIndex >= 0 ? currentSlugIndex : -1)
      setPercentage(currentSlugIndex >= 0 ? barSegmentMultiplier * currentSlugIndex : 0)
    }
  }, [currentSlug, setCurrentSlugIndex, playbook])

  const navigateToPlay = (e, slug) => {
    e.preventDefault()

    setCurrentSlug(slug)
    const playSlugs = playbook.playbookPlays.map(play => play.playSlug)

    let index = 0
    let height = 0
    if (slug !== OVERVIEW_SLUG_NAME) {
      height = slugHeights[OVERVIEW_SLUG_NAME]
      while (index < playSlugs.length && playSlugs[index] !== slug) {
        height = height + slugHeights[playSlugs[index]]
        index = index + 1
      }
    }

    window.scrollTo({
      top: height,
      behavior: 'smooth'
    })
  }

  const slugNameMapping = (() => {
    return { [[playbook.slug]]: playbook.name }
  })()

  return (
    <div className='bg-dial-sunshine sticky sticky-under-header'>
      <div className='flex flex-wrap gap-3'>
        <div className='px-8 py-3 flex flex-col gap-1'>
          <div className='hidden lg:block'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
          <div className='flex flex-col md:flex-row gap-x-2'>
            <div className='text-2xl font-semibold'>{playbook.name}</div>
            {(isAdminUser || isEditorUser) &&
              <div className='text-sm italic text-white md:self-center'>
                ({format(isPlaybookPublished ? 'ui.playbook.status.published' : 'ui.playbook.status.draft')})
              </div>
            }
          </div>
        </div>
        <div className='flex lg:ml-auto px-8 lg:px-4 pb-3 lg:pb-0 my-auto overflow-x-auto'>
          <div className='play-progress'>
            <div className='play-progress-bar' style={{ width: `${percentage}%` }} />
            <div className='play-progress-bar-base' />
            <div className='play-progress-number'>
              {playbook.playbookPlays.map(({ playSlug }, index) => {
                return (
                  <a key={index} href='#' onClick={(e) => navigateToPlay(e, playSlug)}>
                    <div className={`step ${index <= currentSlugIndex && 'active'}`}>
                      {index + 1}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetailHeader

import { forwardRef, useRef, useImperativeHandle, useEffect, useContext } from 'react'
import { ObjectType } from '../utils/constants'
import CommentsSection from '../shared/comment/CommentsSection'
import PlaybookDetailOverview, { OVERVIEW_SLUG_NAME } from './fragments/PlaybookDetailOverview'
import PlaybookDetailPlayList from './fragments/PlaybookDetailPlayList'
import { PlaybookDetailContext, PlaybookDetailDispatchContext } from './context/PlaybookDetailContext'

const PlaybookDetailRight = forwardRef(({ playbook, locale }, ref) => {
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const { slugHeights } = useContext(PlaybookDetailContext)
  const { setCurrentSlug } = useContext(PlaybookDetailDispatchContext)

  useEffect(() => {
    const onScroll = () => {
      const currentYScroll = window.scrollY
      const playSlugs = playbook.playbookPlays.map(play => play.playSlug)

      if (currentYScroll < slugHeights[OVERVIEW_SLUG_NAME]) {
        setCurrentSlug(OVERVIEW_SLUG_NAME)
      } else {
        let index = 0
        let height = slugHeights[OVERVIEW_SLUG_NAME] + slugHeights[playSlugs[index]]
        while (index < playSlugs.length && currentYScroll >= height) {
          height = height + slugHeights[playSlugs[index ++]]
        }

        setCurrentSlug(playSlugs[index])
      }
    }

    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [playbook, setCurrentSlug, slugHeights])

  return (
    <div className='flex flex-col gap-y-3'>
      <PlaybookDetailOverview
        locale={locale}
        playbook={playbook}
        allowEmbedCreation
      />
      <PlaybookDetailPlayList
        locale={locale}
        playbook={playbook}
      />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={playbook.id}
        objectType={ObjectType.PLAYBOOK}
      />
    </div>
  )
})

PlaybookDetailRight.displayName = 'PlaybookDetailRight'

export default PlaybookDetailRight

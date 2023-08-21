import { forwardRef, useRef, useImperativeHandle } from 'react'
import { ObjectType } from '../utils/constants'
import CommentsSection from '../shared/comment/CommentsSection'
import PlaybookDetailOverview from './fragments/PlaybookDetailOverview'
import PlaybookDetailPlayList from './fragments/PlaybookDetailPlayList'

const PlaybookDetailRight = forwardRef(({ playbook, locale }, ref) => {
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <PlaybookDetailOverview
        playbook={playbook}
        locale={locale}
        allowEmbedCreation
      />
      <PlaybookDetailPlayList
        playbook={playbook}
        locale={locale}
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

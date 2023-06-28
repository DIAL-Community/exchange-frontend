import { createRef, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { HtmlViewer } from '../shared/HtmlViewer'
import TagCard from '../tags/TagCard'
import PlaybookDetailMenu from './PlaybookDetailMenu'
import { PlaybookDetailDispatchContext } from './PlaybookDetailContext'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const PlaybookDetailOverview = ({ playbook, locale, allowEmbedCreation, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [height, setHeight] = useState(0)
  const { updateSlugInformation } = useContext(PlaybookDetailDispatchContext)

  const ref = createRef()

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

  return (
    <div className='flex flex-col gap-3 px-3' ref={ref}>
      <PlaybookDetailMenu
        playbook={playbook}
        locale={locale}
        allowEmbedCreation={allowEmbedCreation}
        commentsSectionRef={commentsSectionRef}
      />
      <div className='h4'>{format('playbooks.overview')}</div>
      <HtmlViewer
        initialContent={playbook?.playbookDescription?.overview}
        editorId='playbook-overview'
        className='-mt-4'
      />
      <div className='h4'>{format('playbooks.audience')}</div>
      <HtmlViewer
        initialContent={playbook.playbookDescription.audience}
        editorId='playbook-audience'
        className='-mt-4'
      />
      <div className='h4'>{format('playbooks.outcomes')}</div>
      <HtmlViewer
        initialContent={playbook.playbookDescription.outcomes}
        editorId='playbook-outcomes'
        className='-mt-4'
      />
      {
        playbook.author &&
          <>
            <div className='h4'>{format('playbook.author')}:</div>
            <div className='text-dial-gray-dark'>&nbsp;{playbook.author}</div>
          </>
      }
      {
        playbook.tags.length > 0 &&
        <>
          <div className='h4 mt-3'>{format('playbook.tags')}:</div>
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {playbook.tags.map((tag, tagIdx) =>
              <TagCard tag={tag} listType='list' key={`playbook-tag-${tagIdx}`} />)
            }
          </div>
        </>
      }
    </div>
  )
}

export default PlaybookDetailOverview

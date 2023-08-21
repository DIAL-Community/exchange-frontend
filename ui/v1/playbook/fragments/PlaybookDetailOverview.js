import { useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { PlaybookDetailDispatchContext } from '../context/PlaybookDetailContext'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import TagCard from '../../tag/TagCard'
import { DisplayType } from '../../utils/constants'
import PlaybookDetailMenu from './PlaybookDetailMenu'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const PlaybookDetailOverview = ({ locale, playbook, allowEmbedCreation }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const ref = useRef()
  const { setSlugHeights } = useContext(PlaybookDetailDispatchContext)

  useEffect(() => {
    if (ref.current) {
      // Update context for this overview. We're using fake slug data for this.
      setSlugHeights(currentSlugHeights => {
        const heights = { ...currentSlugHeights }
        heights[OVERVIEW_SLUG_NAME] = ref.current.clientHeight

        return heights
      })
    }
  }, [setSlugHeights, ref])

  return (
    <div className='flex flex-col gap-3 px-3' ref={ref}>
      <PlaybookDetailMenu
        playbook={playbook}
        locale={locale}
        allowEmbedCreation={allowEmbedCreation}
      />
      <div className='h4'>{format('ui.playbook.overview')}</div>
      <HtmlViewer
        initialContent={playbook?.playbookDescription?.overview}
        editorId='playbook-overview'
        className='-mt-4'
      />
      <div className='h4'>{format('ui.playbook.audience')}</div>
      <HtmlViewer
        initialContent={playbook.playbookDescription.audience}
        editorId='playbook-audience'
        className='-mt-4'
      />
      <div className='h4'>{format('ui.playbook.outcomes')}</div>
      <HtmlViewer
        initialContent={playbook.playbookDescription.outcomes}
        editorId='playbook-outcomes'
        className='-mt-4'
      />
      {playbook.author &&
        <>
          <div className='h4'>{format('ui.playbook.author')}:</div>
          <div className='text-dial-gray-dark'>&nbsp;{playbook.author}</div>
        </>
      }
      {playbook.tags.length > 0 &&
        <>
          <div className='h4 mt-3'>{format('ui.playbook.tags')}:</div>
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {playbook.tags.map((tag, tagIdx) =>
              <TagCard tag={tag} displayType={DisplayType.SMALL_CARD} key={`playbook-tag-${tagIdx}`} />)
            }
          </div>
        </>
      }
    </div>
  )
}

export default PlaybookDetailOverview

import { useCallback, useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { PlaybookDetailDispatchContext } from '../context/PlaybookDetailContext'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import PlaybookDetailMenu from './PlaybookDetailMenu'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const PlaybookDetailOverview = ({ locale, playbook, allowEmbedCreation }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      />
      <div className='h4'>{format('ui.playbook.audience')}</div>
      <HtmlViewer
        initialContent={playbook.playbookDescription.audience}
        editorId='playbook-audience'
      />
      <div className='h4'>{format('ui.playbook.outcomes')}</div>
      <HtmlViewer
        initialContent={playbook.playbookDescription.outcomes}
        editorId='playbook-outcomes'
      />
      {playbook.author &&
        <>
          <div className='h4'>{format('ui.playbook.author')}</div>
          <div className='text-dial-gray-dark'>{playbook.author}</div>
        </>
      }
      {playbook.tags.length > 0 &&
        <>
          <div className='h4 mt-3'>{format('ui.tag.header')}</div>
          <div className='italic text-sm'>
            {playbook.tags.join(', ')}
          </div>
        </>
      }
    </div>
  )
}

export default PlaybookDetailOverview

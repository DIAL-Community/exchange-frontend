import { useCallback, useContext, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useIntl } from 'react-intl'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { PlaybookContext, OVERVIEW_SLUG_VALUE } from './PlaybookContext'
import PlaybookDetailMenu from './PlaybookDetailMenu'

const PlaybookHeader = ({ playbook, playRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setPlayPercentages } = useContext(PlaybookContext)

  const { ref } = useInView({
    threshold: [0.001, 0.2, 0.4, 0.6, 0.8, 0.999],
    onChange: (inView, entry) => {
      setPlayPercentages(
        previousPlayPercentage => ({
          ...previousPlayPercentage,
          [OVERVIEW_SLUG_VALUE]: entry.intersectionRatio
        })
      )
    }
  })

  const scrollRef = useRef(null)
  useEffect(() => {
    if (playRefs.current) {
      playRefs.current[OVERVIEW_SLUG_VALUE] = scrollRef
    }
  }, [scrollRef, playRefs])

  return (
    <div className='intersection-observer' ref={ref}>
      <div className='flex flex-col gap-3 sticky-scroll-offset' ref={scrollRef}>
        <PlaybookDetailMenu playbook={playbook} />
        <div className='flex flex-wrap gap-3'>
          <div className='font-semibold text-2xl'>
            {format('ui.playbook.overview')}
          </div>
        </div>
        <HtmlViewer initialContent={playbook?.playbookDescription?.overview} />
        {playbook.author &&
          <div>
            <div className='h4'>{format('ui.playbook.author')}</div>
            <div className='text-dial-gray-dark'>{playbook.author}</div>
          </div>
        }
        {playbook.tags.length > 0 &&
          <div className='flex flex-col gap-3'>
            <div className='font-semibold'>
              {format('ui.tag.header')}
            </div>
            <div className='italic text-sm'>
              {playbook.tags.join(', ')}
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default PlaybookHeader

import { useCallback, useContext, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useIntl } from 'react-intl'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { CurriculumContext, OVERVIEW_SLUG_NAME } from './CurriculumContext'

const CurriculumHeader = ({ curriculum, moduleRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setModulePercentages } = useContext(CurriculumContext)

  const { ref } = useInView({
    threshold: [0.001, 0.2, 0.4, 0.6, 0.8, 0.999],
    onChange: (inView, entry) => {
      setModulePercentages(
        previousModulePercentage => ({
          ...previousModulePercentage,
          [OVERVIEW_SLUG_NAME]: entry.intersectionRatio
        })
      )

      console.log('Is in view? inView=', inView, ', slug=', OVERVIEW_SLUG_NAME)
      console.log('Entry data: ', entry)
    }
  })

  const scrollRef = useRef(null)
  useEffect(() => {
    if (moduleRefs.current) {
      moduleRefs.current[OVERVIEW_SLUG_NAME] = scrollRef
    }
  }, [scrollRef, moduleRefs])

  return (
    <div className='intersection-observer' ref={ref}>
      <div className='flex flex-col gap-3 sticky-scroll-offset' ref={scrollRef}>
        <div className='flex flex-wrap gap-3'>
          <div className='font-semibold text-2xl'>
            {format('ui.playbook.overview')}
          </div>
        </div>
        <HtmlViewer initialContent={curriculum?.playbookDescription?.overview} />
        {curriculum.author &&
          <div>
            <div className='h4'>{format('ui.playbook.author')}</div>
            <div className='text-dial-gray-dark'>{curriculum.author}</div>
          </div>
        }
        {curriculum.tags.length > 0 &&
          <div className='flex flex-col gap-3'>
            <div className='font-semibold'>
              {format('ui.tag.header')}
            </div>
            <div className='italic text-sm'>
              {curriculum.tags.join(', ')}
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default CurriculumHeader

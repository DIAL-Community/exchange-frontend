import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FiMove } from 'react-icons/fi'
import { useInView } from 'react-intersection-observer'
import { useIntl } from 'react-intl'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { CurriculumContext, OVERVIEW_SLUG_NAME } from './CurriculumContext'
import RearrangeModules from './forms/RearrangeModules'

const CurriculumHeader = ({ curriculum, moduleRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayRearrangeDialog, setDisplayRearrangeDialog] = useState(false)
  const onRearrangeDialogClose = () => {
    setDisplayRearrangeDialog(false)
  }

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
        <div className='flex ml-auto'>
          <button
            type='button'
            onClick={() => setDisplayRearrangeDialog(!displayRearrangeDialog)}
            className='cursor-pointer bg-dial-iris-blue px-2 py-2 rounded text-white'
          >
            <FiMove className='inline pb-0.5' />
            <span className='text-sm px-1'>
              {format('dpi.curriculum.module.rearrange')}
            </span>
          </button>
        </div>
        <div className='flex flex-wrap gap-3'>
          <div className='font-semibold text-2xl'>
            {format('dpi.curriculum.overview')}
          </div>
        </div>
        <HtmlViewer initialContent={curriculum?.playbookDescription?.overview} />
        {curriculum.author &&
          <div>
            <div className='h4'>{format('dpi.curriculum.author')}</div>
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
        <RearrangeModules
          onRearrangeDialogClose={onRearrangeDialogClose}
          displayRearrangeDialog={displayRearrangeDialog}
          curriculum={curriculum}
        />
      </div>
    </div>
  )
}

export default CurriculumHeader

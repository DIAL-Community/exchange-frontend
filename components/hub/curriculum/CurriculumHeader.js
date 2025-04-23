import { useCallback, useContext, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { UPDATE_PLAYBOOK_DESCRIPTION } from '../../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { ObjectType } from '../../utils/constants'
import { DPI_TENANT_NAME } from '../constants'
import { CurriculumContext, OVERVIEW_SLUG_VALUE } from './CurriculumContext'
import CurriculumDetailMenu from './CurriculumDetailMenu'

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
          [OVERVIEW_SLUG_VALUE]: entry.intersectionRatio
        })
      )
    }
  })

  const [ updateDescription ] = useMutation(UPDATE_PLAYBOOK_DESCRIPTION, {
    refetchQueries: [
      {
        query: PLAYBOOK_DETAIL_QUERY,
        variables: { slug:curriculum.slug, owner: DPI_TENANT_NAME }
      }
    ]
  })

  const handleHtmlChanged = (html) => {
    updateDescription({
      variables: {
        slug: curriculum.slug,
        type: ObjectType.PLAYBOOK,
        owner: DPI_TENANT_NAME,
        fieldName: 'overview',
        description: html
      }
    })
  }

  const scrollRef = useRef(null)
  useEffect(() => {
    if (moduleRefs.current) {
      moduleRefs.current[OVERVIEW_SLUG_VALUE] = scrollRef
    }
  }, [scrollRef, moduleRefs])

  return (
    <div className='intersection-observer' ref={ref}>
      <div className='flex flex-col gap-3 sticky-scroll-offset' ref={scrollRef}>
        <CurriculumDetailMenu curriculum={curriculum} />
        <div className='flex flex-wrap gap-3'>
          <div className='font-semibold text-2xl'>
            {format('hub.curriculum.overview')}
          </div>
        </div>
        <HtmlViewer
          initialContent={curriculum?.playbookDescription?.overview}
          handleHtmlChanged={handleHtmlChanged}
        />
        {curriculum.author &&
          <div>
            <div className='h4'>{format('hub.curriculum.author')}</div>
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

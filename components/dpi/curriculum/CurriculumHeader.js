import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { HtmlViewer } from '../../shared/form/HtmlViewer'

const CurriculumHeader = ({ curriculum, ref }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3' ref={ref}>
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
  )
}

export default CurriculumHeader

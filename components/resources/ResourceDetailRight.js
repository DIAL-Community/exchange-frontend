import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../lib/utilities'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'

const ResourceDetailRight = ({ resource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {}
    map[resource.slug] = resource.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row flex-wrap'>
        <div className='flex flex-col flex-grow pb-4'>
          <HtmlViewer
            initialContent={resource?.description}
            editorId='resource-detail'
          />
          <div className='text-sm text-dial-purple-light'>
            {format('ui.resource.link').toUpperCase()}
          </div>
          <div className='text-base text-dial-teal flex'>
            <a
              href={prependUrlWithProtocol(resource.link)}
              className='border-b-2 border-transparent hover:border-dial-sunshine'
              target='_blank'
              rel='noreferrer'
            >
              <div className='my-auto'>{resource.link} ⧉</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailRight

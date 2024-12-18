import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import ResourceCard from '../resources/fragments/ResourceCard'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteResourceTopic from './fragments/DeleteResourceTopic'
import ResourceTopicCard from './ResourceTopicCard'

const ResourceTopicDetailRight = forwardRef(({ resourceTopic, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const subtopicsRef = useRef()
  const resourceRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.resource.header', ref: resourceRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${resourceTopic.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          { deletingAllowed && <DeleteResourceTopic resourceTopic={resourceTopic} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum pb-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={resourceTopic?.resourceTopicDescription?.description}
            editorId='resourceTopic-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={subtopicsRef}>
            {format('ui.resourceTopic.subTopics')}
          </div>
          {resourceTopic?.subtopics?.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.resourceTopic.subtopics'),
                base: format('ui.resourceTopic.label')
              })}
            </div>
          }
          {resourceTopic?.subtopics?.length > 0 &&
            <div className='grid grid-cols-1 gap-x-8 gap-y-3'>
              {resourceTopic?.subtopics?.map((subtopic, index) =>
                <div key={`resource-${index}`}>
                  <ResourceTopicCard
                    index={index}
                    resourceTopic={subtopic}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={resourceRef}>
            {format('ui.resource.header')}
          </div>
          {resourceTopic?.resources.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.resource.label'),
                base: format('ui.resourceTopic.label')
              })}
            </div>
          }
          {resourceTopic?.resources.length > 0 &&
            <div className='grid grid-cols-1 gap-x-8 gap-y-3'>
              {resourceTopic?.resources?.map((resource, index) =>
                <div key={`resource-${index}`}>
                  <ResourceCard
                    index={index}
                    resource={resource}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={resourceTopic} objectType={ObjectType.RESOURCE_TOPIC} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={resourceTopic.id}
          objectType={ObjectType.RESOURCE_TOPIC}
        />
      </div>
    </div>
  )
})

ResourceTopicDetailRight.displayName = 'ResourceTopicDetailRight'

export default ResourceTopicDetailRight

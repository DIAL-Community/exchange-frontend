import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import { prependUrlWithProtocol } from '../utils/utilities'
import DeleteResource from './DeleteResource'
import ResourceDetailProducts from './fragments/ResourceDetailProducts'
import { topicColors } from './utilities/common'

const ResourceDetailRight = forwardRef(({ resource }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const titleRef = useRef()
  const productRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.scrollToTop', ref: titleRef },
      { value: 'ui.product.label', ref: productRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${resource.slug}/edit`

  const generateResourceUrl = () => {
    let resourceLinkUrl
    if (resource.resourceFile) {
      resourceLinkUrl = `${process.env.NEXT_PUBLIC_GRAPHQL_SERVER}${resource.resourceFile}`
    } else if (resource.resourceLink) {
      resourceLinkUrl = prependUrlWithProtocol(resource.resourceLink)
    }

    return resourceLinkUrl
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex items-center gap-6'>
          {resource.resourceTopics &&
            <div className='flex flex-wrap gap-x-3 gap-y-2'>
              {resource.resourceTopics.map((topic, index) => (
                <div key={index} className={`${topicColors(topic.name)} rounded-md shadow-lg`}>
                  <div className='text-sm px-5 py-2'>
                    {topic.name}
                  </div>
                </div>
              ))}
            </div>
          }
          {resource.resourceType &&
            <div className='text-sm'>
              {format(resource.resourceType)}
            </div>
          }
          <div className='ml-auto'>
            {resource.publishedDate &&
              <FormattedDate
                value={resource.publishedDate}
                year="numeric"
                month="long"
                day="2-digit"
              />
            }
          </div>
          {canEdit && (
            <div className='flex gap-x-3'>
              <EditButton type='link' href={editPath} />
              {isAdminUser && <DeleteResource resource={resource} />}
            </div>
          )}
        </div>
        <div className='text-4xl font-semibold text-dial-stratos py-3' ref={titleRef}>
          {resource?.name}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={resource?.description}
            editorId='resource-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-stratos pb-3'>
            {format('ui.resource.resourceLink')}
          </div>
          <div className='flex text-dial-stratos'>
            <a
              href={generateResourceUrl()}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1 break-all'>
                {resource.linkDescription
                  ? resource.linkDescription
                  : resource.resourceFile
                    ? resource.resourceFile
                    : resource.resourceLink
                }
              </div>
            </a>
            &nbsp;⧉
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ResourceDetailProducts
            resource={resource}
            canEdit={canEdit}
            headerRef={productRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={resource} objectType={ObjectType.RESOURCE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={resource.id}
          objectType={ObjectType.RESOURCE}
        />
      </div>
    </div>
  )
})

ResourceDetailRight.displayName = 'ResourceDetailRight'

export default ResourceDetailRight

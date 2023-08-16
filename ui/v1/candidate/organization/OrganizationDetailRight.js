import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { ObjectType } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'
import { prependUrlWithProtocol } from '../../utils/utilities'

const OrganizationDetailRight = ({ organization, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !organization.markdownUrl

  const editPath = `${organization.slug}/edit`
  const [submitter] = organization.contacts

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={organization?.description}
            editorId='organization-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      {organization.website &&
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-meadow'>
            {format('dataset.visualizationUrl')}
          </div>
          <div className='my-auto text-sm flex'>
            <a href={prependUrlWithProtocol(organization.website)} target='_blank' rel='noreferrer'>
              <div className='border-b border-dial-iris-blue line-clamp-1'>
                {organization.website} ⧉
              </div>
            </a>
          </div>
        </div>
      }
      {submitter?.email &&
        <>
          <hr className='bg-dial-blue-chalk mt-6 mb-3' />
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-meadow'>
              {format('ui.candidate.submitter')}
            </div>
            <div className='text-sm'>
              {submitter.name}
            </div>
            <div className='text-sm flex'>
              <a
                className='border-b border-dial-iris-blue'
                href={`mailto:${submitter.email}`}
                target='_blank'
                rel='noreferrer'
              >
                {submitter.email}
              </a>
            </div>
          </div>
        </>
      }
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={organization.id}
        objectType={ObjectType.CANDIDATE_ORGANIZATION}
      />
    </div>
  )
}

export default OrganizationDetailRight

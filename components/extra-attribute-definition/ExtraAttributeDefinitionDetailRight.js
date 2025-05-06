import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { ObjectType } from '../utils/constants'
import DeleteExtraAttributeDefinition from './fragments/DeleteExtraAttributeDefinition'

const ExtraAttributeDefinitionDetailRight = forwardRef((
  {
    extraAttributeDefinition,
    editingAllowed,
    deletingAllowed
  },
  ref
) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const organizationRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${extraAttributeDefinition.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          { deletingAllowed && <DeleteExtraAttributeDefinition extraAttributeDefinition={extraAttributeDefinition} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {extraAttributeDefinition.description}
        </div>
        <div className='text-sm text-dial-stratos'>
          {extraAttributeDefinition.name} - {format(extraAttributeDefinition.attributeType)}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={extraAttributeDefinition} objectType={ObjectType.EXTRA_ATTRIBUTE_DEFINITION} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={extraAttributeDefinition.id}
          objectType={ObjectType.EXTRA_ATTRIBUTE_DEFINITION}
        />
      </div>
    </div>
  )
})

ExtraAttributeDefinitionDetailRight.displayName = 'ExtraAttributeDefinitionDetailRight'

export default ExtraAttributeDefinitionDetailRight

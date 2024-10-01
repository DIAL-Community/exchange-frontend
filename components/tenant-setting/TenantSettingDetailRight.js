import { useRef } from 'react'
import { useUser } from '../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { ObjectType } from '../utils/constants'
import DeleteTenantSetting from './DeleteTenantSetting'

const TenantSettingDetailRight = ({ tenantSetting }) => {

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const commentsSectionRef = useRef()

  const editPath = `${tenantSetting.tenantName}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6 min-h-[70vh]'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteTenantSetting tenantSetting={tenantSetting} />}
          </div>
        )}
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-3'>
          <Bookmark object={tenantSetting} objectType={ObjectType.TENANT_SETTING} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={tenantSetting.id}
          objectType={ObjectType.TENANT_SETTING}
        />
      </div>
    </div>
  )
}

TenantSettingDetailRight.displayName = 'TenantSettingDetailRight'

export default TenantSettingDetailRight

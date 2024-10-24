import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { TENANT_SETTING_POLICY_QUERY } from '../shared/query/tenantSetting'
import { ObjectType } from '../utils/constants'
import DeleteTenantSetting from './DeleteTenantSetting'

const TenantSettingDetailRight = forwardRef(({ tenantSetting }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => [{ value: 'ui.comment.label', ref: commentsSectionRef }], [])

  const editPath = `${tenantSetting.tenantName}/edit`

  let editingAllowed = false
  const { error } = useQuery(TENANT_SETTING_POLICY_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (!error) {
    editingAllowed = true
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6 min-h-[70vh]'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          <DeleteTenantSetting tenantSetting={tenantSetting} />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3'>
            {format('ui.tenantSetting.tenantDomains')}
          </div>
          {tenantSetting?.tenantDomains.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.tenantSetting.tenantDomain'),
                base: format('ui.tenantSetting.label')
              })}
            </div>
          }
          {tenantSetting?.tenantDomains.length > 0 &&
            <div className='flex flex-col gap-3'>
              {tenantSetting?.tenantDomains?.map((tenantDomain, index) =>
                <div key={`tenant-domain-${index}`}>
                  {tenantDomain}
                </div>
              )}
            </div>
          }
        </div>
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
})

TenantSettingDetailRight.displayName = 'TenantSettingDetailRight'

export default TenantSettingDetailRight

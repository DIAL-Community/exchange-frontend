import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { useUser } from '../../../lib/hooks'
import ProductCard from '../product/ProductCard'
import OrganizationCard from '../organization/OrganizationCard'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteUser from './DeleteUser'

const UserDetailRight = forwardRef(({ user }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const descRef = useRef()
  const roleRef = useRef()
  const productRef = useRef()
  const organizationRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.role.header', ref: roleRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${user.id}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteUser user={user} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-stratos py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          {user.email}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-stratos py-3'>
            {format('user.roles')}
          </div>
          <div className='line-clamp-4 text-dial-stratos text-sm'>
            {user?.roles.map(x => x.toUpperCase()).join(', ')}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-meadow py-3' ref={productRef}>
            {format('ui.product.header')}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
            {user?.products.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.product.label'),
                  base: format('ui.user.label')
                })}
              </div>
            }
            {user?.products?.map((product, index) =>
              <div key={`product-${index}`}>
                <ProductCard
                  index={index}
                  product={product}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-plum py-3' ref={organizationRef}>
            {format('ui.organization.label')}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
            {!user?.organization &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.organization.label'),
                  base: format('ui.user.label')
                })}
              </div>
            }
            {user?.organization &&
              <OrganizationCard
                organization={user?.organization}
                displayType={DisplayType.SMALL_CARD}
              />
            }
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-plum'>
            {format('ui.user.accountDetails')}
          </div>
          <div className='text-xs italic'>
            {format('ui.user.createdAt')}:&nbsp;
            <FormattedDate value={user.createdAt} />&nbsp;
            <FormattedTime value={user.createdAt} />
          </div>
          {`${user.confirmed}` === 'true' &&
            <div className='text-xs italic'>
              {format('ui.user.confirmedAt')}:&nbsp;
              <FormattedDate value={user.confirmedAt} />&nbsp;
              <FormattedTime value={user.confirmedAt} />
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={user.id}
          objectType={ObjectType.USER}
        />
      </div>
    </div>
  )
})

UserDetailRight.displayName = 'UserDetailRight'

export default UserDetailRight

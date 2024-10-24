import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import OrganizationCard from '../organization/OrganizationCard'
import ProductCard from '../product/ProductCard'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { USER_DETAIL_QUERY } from '../shared/query/user'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteUser from './buttons/DeleteUser'

const UserDetailRight = forwardRef(({ user }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  let editingAllowed = true
  const { error } = useQuery(USER_DETAIL_QUERY, {
    variables: { userId: crypto.randomUUID() },
    fetchPolicy: 'no-cache',
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (error) {
    editingAllowed = false
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {editingAllowed && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            <DeleteUser user={user} />
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
          <div className='text-xl font-semibold text-dial-stratos pb-3'>
            {format('user.roles')}
          </div>
          <div className='line-clamp-4 text-dial-stratos text-sm'>
            {user?.roles.map(x => x.toUpperCase()).join(', ')}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-meadow pb-3' ref={productRef}>
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
          <div className='text-xl font-semibold text-dial-plum pb-3' ref={organizationRef}>
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
          {`${user.confirmed}` === 'false' &&
            <div className='text-xs italic flex'>
              <div className='bg-red-200'>
                {format('ui.user.confirmedAt')}:&nbsp;
                {format('general.na')}
              </div>
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={user} objectType={ObjectType.USER} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
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

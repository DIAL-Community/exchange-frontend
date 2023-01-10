import { useIntl } from 'react-intl'
import { useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import EditButton from '../shared/EditButton'
import Breadcrumb from '../shared/breadcrumb'

const UserDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()
  const slugNameMapping = useMemo(() => ({ [user.id]: user.username }), [user])

  return (
    <>
      <div className='flex flex-col lg:flex-row justify-between pb-8'>
        <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          <div className='pb-4'>
            {session?.user.canEdit && <EditButton type='link' href={`/users/${user.id}/edit`} />}
          </div>
          <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
            <div className='flex flex-col h-80 p-4'>
              <div className='m-auto align-middle w-48'>
                <img
                  className='w-24 m-auto'
                  alt={format('image.alt.logoFor', { name: user.username })}
                  src='/icons/user.svg'
                />
              </div>
              <div className='text-sm text-center text-dial-gray-dark'>
                {format('profile.email')} : {user.email}
              </div>
            </div>
          </div>
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4 flex flex-col'>
          <div className='hidden lg:block'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row gap-2'>
              <div className='font-semibold'>{format('profile.profile')}:</div>
              <div>{user.username}</div>
            </div>
            <div className='flex flex-row gap-2'>
              <div className='font-semibold'>{format('profile.roles')}:</div>
              <div>{user.roles.map(role => role.toUpperCase()).join(', ')}</div>
            </div>
            {
              user?.products?.length > 0 &&
                <div className='flex flex-row gap-2'>
                  <div className='font-semibold'>{format('profile.products')}:</div>
                  <div>{user.products.map(prod => prod.name).join(', ')}</div>
                </div>
            }
            {
              user?.organization &&
                <div className='flex flex-row gap-2'>
                  <div className='font-semibold'>{format('profile.organization')}:</div>
                  <div>{user.organization.name}</div>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetail

import { useIntl } from 'react-intl'
import { useMemo } from 'react'
import { useSession } from 'next-auth/client'
import EditButton from '../shared/EditButton'
import Breadcrumb from '../shared/breadcrumb'

const UserDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [session] = useSession()
  const slugNameMapping = useMemo(() => ({ [user.id]: user.username }), [user])

  return (
    <>
      <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
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
            <div className='h3'>
              {format('profile.profile')}{user.username}
            </div>
            <div className='h4'>
              {format('profile.roles')} {user.roles.map(role => role.toUpperCase()).join(', ')}
            </div>
            {
              user?.products?.length &&
                <div className='h4'>
                  {format('profile.products')} {user.products.map(prod => prod.name).join(', ')}
                </div>
            }
            {
              user?.organization && 
                <div className='h4'>
                  {format('profile.organization')} {user.organization.name}
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetail

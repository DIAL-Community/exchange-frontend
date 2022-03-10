import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'

const UserDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [session] = useSession()

  return (
    <>
      <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
        <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          {
            session && session.user.canEdit && (
              <a href={`/users/${user.id}/edit`} className='bg-dial-blue px-2 py-1 rounded text-white mr-5 mb-5'>
                <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                <span className='text-sm px-2'>{format('app.edit')}</span>
              </a>
            )
          }
          <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
            <div className='flex flex-col h-80 p-4'>
              <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 bg-white bg-opacity-80 text-dial-purple'>
                {format('profile.username')} : {user.username}
              </div>
              <div className='pt-8 m-auto align-middle w-48'>
                <img
                  alt={format('image.alt.logoFor', { name: user.username })}
                  src={user.image}
                />
              </div>
              <div className='text-sm text-center text-dial-gray-dark'>
                {format('profile.email')} : {user.email}
              </div>
            </div>
          </div>
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <div className='my-4 h2'>
            {format('profile.profile')}{user.username}
          </div>
          <div className='my-3 h4'>
            {format('profile.roles')} {user.roles.map(role => role.toUpperCase() + '; ')}
          </div>
          <div className='my-3 h4'>
            {format('profile.products')} {user.products.map(prod => prod.name)}
          </div>
          <div className='my-3 h4'>
            {format('profile.organization')} {user.organization && user.organization.name}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetail

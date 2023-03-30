import Link from 'next/link'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { convertToKey } from '../context/FilterContext'

const collectionPath = convertToKey('Users')

const ellipsisTextStyle = `
   whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-sunshine
  text-button-gray hover:text-dial-sunshine
`

const UserCard = ({ user, listType, newTab = false }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <Link href={`/${collectionPath}/${user.id}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div className={containerElementStyle}>
                <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='grid grid-cols-12 gap-x-4 py-4 px-4'>
                    <div className={`col-span-8 text-base font-semibold ${ellipsisTextStyle}`}>
                      <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
                      {user.username} ({user.email})
                    </div>
                    <div className='col-span-4 p-1.5'>
                      <div className='ml-auto text-button-gray-light text-sm font-semibold'>
                        {user.roles.map(role => role.toUpperCase()).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div className={containerElementStyle}>
                <div className='border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray'>
                    <div className='ml-auto text-button-gray-light text-sm font-semibold'>
                      {user.roles.toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80 z-10'>
                      {user.name}
                    </div>
                    <div className='m-auto align-middle w-40'>
                      <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='60px' width='60px' />
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </a>
    </Link>
  )
}

export default UserCard

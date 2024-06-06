import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiEdit3 } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ADLI_CONTACT_DETAIL_QUERY } from '../../shared/query/contact'
import ContactCard from './ContactCard'
import UserDetail from './UserDetail'

const ContactBio = ({ contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { asPath } = useRouter()
  const generateEditPath = () => {
    if (asPath.indexOf('dpi-admin/profile') >= 0) {
      return '/dpi-admin/profile/edit-profile'
    } else if (asPath.indexOf('dpi-admin/users') >= 0) {
      return `/dpi-admin/users/${user.id}/edit-profile`
    } else {
      return '/dpi-dashboard/profile/edit-profile'
    }
  }

  return (
    <div className='relative flex flex-col gap-3'>
      {user && (
        <div className='cursor-pointer absolute -top-3 -right-1'>
          <Link href={generateEditPath()} className=' bg-dial-iris-blue px-3 py-2 rounded text-white'>
            <FiEdit3 className='inline pb-0.5' />
            <span className='text-sm px-1'>
              {`${format('app.edit')} ${format('ui.user.profile')}`}
            </span>
          </Link>
        </div>
      )}
      <div class="font-bold">
        About Me
      </div>
      <p class="text-sm leading-6">
        {contact?.biography ?? format('dpi.admin.user.defaultBio')}
      </p>
      <hr className='border-b border-dial-blue-chalk my-3' />
    </div>
  )
}

const ProfileDetail = ({ user }) => {
  const { data } = useQuery(ADLI_CONTACT_DETAIL_QUERY, {
    variables: { slug: user.email, source: 'adli' }
  })

  return (
    <div className='flex flex-col gap-y-3 text-dial-cotton'>
      <div className='flex flex-row gap-12 py-8'>
        <div className='shrink-0'>
          <ContactCard contact={data?.contact} />
        </div>
        <div className='grow text-sm flex flex-col gap-3'>
          <ContactBio contact={data?.contact} />
          <UserDetail user={user} />
        </div>
      </div>
    </div>
  )
}

export default ProfileDetail

import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiEdit3 } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { HUB_CONTACT_DETAIL_QUERY } from '../../shared/query/contact'
import { DPI_TENANT_NAME } from '../constants'
import ContactCard from './ContactCard'
import UserDetail from './UserDetail'

const ContactBio = ({ user, contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user: loggedInUser } = useUser()
  const { asPath } = useRouter()
  const generateEditPath = () => {
    if (asPath.indexOf('dpi-admin/profile') >= 0) {
      return '/dpi-admin/profile/edit-contact'
    } else if (asPath.indexOf('dpi-admin/users') >= 0) {
      return `/dpi-admin/users/${user.id}/edit-contact`
    } else {
      return '/dpi-dashboard/profile/edit-contact'
    }
  }

  return (
    <div className='relative flex flex-col gap-3'>
      {loggedInUser && (
        <div className='cursor-pointer absolute -top-3 -right-1'>
          <Link href={generateEditPath()} className=' bg-dial-iris-blue px-3 py-2 rounded text-white'>
            <FiEdit3 className='inline pb-0.5' />
            <span className='text-sm px-1'>
              {`${format('app.edit')} ${format('profile.label')}`}
            </span>
          </Link>
        </div>
      )}
      <div className="font-bold">
        {format('ui.contact.biography')}
      </div>
      <HtmlViewer initialContent={contact?.biography ?? format('ui.contact.biography.placeholder')} />
      <hr className='border-b border-dial-blue-chalk my-3' />
    </div>
  )
}

const ProfileDetail = ({ user }) => {
  const userEmail = user?.email ? user?.email : user?.userEmail

  const { data } = useQuery(HUB_CONTACT_DETAIL_QUERY, {
    variables: { userId: `${user.id}`, email: userEmail, source: DPI_TENANT_NAME }
  })

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-row gap-12 py-8'>
        <div className='basis-2/5 shrink-0'>
          <ContactCard user={user} contact={data?.hubContact} />
        </div>
        <div className='grow text-sm flex flex-col gap-3'>
          <ContactBio user={user} contact={data?.hubContact} />
          <UserDetail user={user} contact={data?.hubContact} />
        </div>
      </div>
    </div>
  )
}

export default ProfileDetail

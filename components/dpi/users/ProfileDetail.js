import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import EditButton from '../../shared/form/EditButton'
import { ADLI_CONTACT_DETAIL_QUERY } from '../../shared/query/contact'
import ContactCard from './ContactCard'
import UserDetail from './UserDetail'

const ContactBio = ({ contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3'>
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
  const { user: loggedInUser } = useUser()

  const { data } = useQuery(ADLI_CONTACT_DETAIL_QUERY, {
    variables: { slug: user.email, source: 'adli' }
  })

  const editPath = `/dpi-admin/users/${user.id}/edit`

  return (
    <div className='relative flex flex-col gap-y-3 text-dial-cotton'>
      {(loggedInUser.isAdliAdminUser || loggedInUser.isAdminUser) && (
        <div className='absolute top-1 -right-1'>
          <EditButton type='link' href={editPath} />
        </div>
      )}
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

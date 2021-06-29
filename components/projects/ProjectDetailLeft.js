import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'

const ProjectDetailLeft = ({ project }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user
    return `
      ${process.env.NEXT_PUBLIC_RAILS_SERVER}/projects/${project.slug}/edit?user_email=${userEmail}&user_token=${userToken}
    `
  }

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb />
      </div>
      <div className='w-full'>
        {
          session && (
            <div className='inline'>
              {
                session.user.canEdit && (
                  <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                    <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                    <span className='text-sm px-2'>{format('app.edit')}</span>
                  </a>
                )
              }
            </div>
          )
        }
      </div>
      <div className='h4 font-bold py-4'>{format('project.label')}</div>
      <div className='bg-white border-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h2 p-2 text-dial-purple overflow-clip'>
            {project.name}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectDetailLeft

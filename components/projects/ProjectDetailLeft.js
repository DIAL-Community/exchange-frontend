import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'

const ProjectDetailLeft = ({ project, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)
  const [session] = useSession()
  const { locale } = useRouter()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/projects/${project.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[project.slug] = project.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full'>
        {
          session && (
            <div className='inline'>
              {canEdit && <EditButton type='link' href={generateEditLink()} />}
            </div>
          )
        }
      </div>
      <div className='h4 font-bold py-4'>{format('project.label')}</div>
      <div className='bg-white border-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h2 p-2 text-dial-purple text-clip'>
            {project.name}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectDetailLeft

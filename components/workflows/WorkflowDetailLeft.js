import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { useUser } from '../../lib/hooks'

const WorkflowDetailLeft = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  const [session] = useSession()

  const { isAdminUser } = useUser(session)

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/workflows/${workflow.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[workflow.slug] = workflow.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full'>
          {isAdminUser && <EditButton type='link' href={generateEditLink()}/>}
          <img src='/icons/comment.svg' className='inline mr-2 ml-3' alt='Edit' height='15px' width='15px' />
          <div className='text-dial-blue inline'>{format('app.comment')}</div>
        </div>
        <div className='h4 font-bold py-4'>{format('workflow.label')}</div>
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 pr-2 text-workflow'>
            {workflow.name}
          </div>
          <div className='m-auto align-middle w-40 workflow-filter'>
            <img
              alt={format('image.alt.logoFor', { name: workflow.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkflowDetailLeft

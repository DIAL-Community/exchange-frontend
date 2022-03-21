import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'
import { useRouter } from 'next/router'

const WorkflowDetailLeft = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  const [session] = useSession()
  const { locale } = useRouter()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session
    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/workflows/${workflow.slug}/` +
        `edit?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
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
          <img src='/icons/comment.svg' className='inline mr-2' alt='Edit' height='15px' width='15px' />
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

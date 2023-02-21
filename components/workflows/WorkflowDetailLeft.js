import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Image from 'next/image'
import { BiCommentDetail } from 'react-icons/bi'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { useUser } from '../../lib/hooks'
import DeleteWorkflow from './DeleteWorkflow'

const WorkflowDetailLeft = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, isAdminUser } = useUser()

  const generateEditLink = () => {
    if (!user) {
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
      <div className='flex flex-col'>
        <div className='flex flex-row gap-3 w-full'>
          {isAdminUser && <EditButton type='link' href={generateEditLink()}/>}
          {isAdminUser && <DeleteWorkflow workflow={workflow} />}
          <div className='flex flex-row gap-1 text-dial-blue '>
            <BiCommentDetail className='my-auto' />
            <div className='inline my-auto'>{format('app.comment')}</div>
          </div>
        </div>
        <div className='h4 font-bold py-4'>{format('workflow.label')}</div>
      </div>
      <div className='bg-white border-2 border-dial-gray shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 pr-2 text-workflow'>
            {workflow.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative workflow-filter' >
            <Image
              layout='fill'
              objectFit='contain'
              sizes='100vw'
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

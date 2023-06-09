import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Image from 'next/image'
import { BiCommentDetail } from 'react-icons/bi'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { useUser } from '../../lib/hooks'
import DeleteResource from './DeleteResource'

const ResourceDetailLeft = ({ resource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const generateEditLink = () => {
    if (!canEdit) {
      return '/edit-not-available'
    }

    return `/resources/${resource.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[resource.slug] = resource.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row gap-3 w-full'>
          {canEdit && <EditButton type='link' href={generateEditLink()}/>}
          {isAdminUser && <DeleteResource resource={resource} />}
          <div className='flex flex-row gap-1 text-dial-blue '>
            <BiCommentDetail className='my-auto' />
            <div className='inline my-auto'>{format('app.comment')}</div>
          </div>
        </div>
        <div className='h4 font-bold py-4'>{format('resource.label')}</div>
      </div>
      <div className='bg-white border-2 border-dial-gray shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='font-semibold text-dial-sapphire text-lg'>
            {resource.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative resource-filter' >
            <Image
              fill
              className='p-2 m-auto object-contain'
              sizes='100vw'
              alt={format('image.alt.logoFor', { name: resource.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ResourceDetailLeft

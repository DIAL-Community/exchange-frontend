import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { ObjectType } from '../../lib/constants'
import CommentsCount from '../shared/CommentsCount'
import { useUser } from '../../lib/hooks'
import DeleteUseCase from './DeleteUseCase'

const UseCaseDetailLeft = ({ useCase, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/use_cases/${useCase.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = useCase.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full inline-flex gap-3'>
          {canEdit && <EditButton type='link' href={generateEditLink()} />}
          {isAdminUser && <DeleteUseCase useCase={useCase} />}
          <CommentsCount
            commentsSectionRef={commentsSectionRef}
            objectId={useCase.id}
            objectType={ObjectType.USE_CASE}
          />
        </div>
        <div className='h4 font-bold py-4'>{format('useCase.label')}</div>
      </div>
      <div className='bg-white border-2 border-dial-gray shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-4/5 md:w-auto lg:w-64 2xl:w-80 text-use-case'>
            {useCase.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative use-case-filter' >
            <Image
              layout='fill'
              objectFit='contain'
              sizes='100vw'
              alt={format('image.alt.logoFor', { name: useCase.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default UseCaseDetailLeft

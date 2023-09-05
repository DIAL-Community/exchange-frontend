import { useIntl } from 'react-intl'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import CommentsCount from '../shared/CommentsCount'
import { ObjectType } from '../../lib/constants'
import { useUser } from '../../lib/hooks'
import DeleteBuildingBlock from './DeleteBuildingBlock'

const BuildingBlockDetailLeft = ({ buildingBlock, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { user, isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/building_blocks/${buildingBlock.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[buildingBlock.slug] = buildingBlock.name

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
          {isAdminUser && <DeleteBuildingBlock buildingBlock={buildingBlock} />}
          <CommentsCount
            commentsSectionRef={commentsSectionRef}
            objectId={buildingBlock.id}
            objectType={ObjectType.BUILDING_BLOCK}
          />
        </div>
        <div className='h4 font-bold py-4'>{format('ui.buildingBlock.label')}</div>
      </div>
      <div className='bg-white border border-dial-gray shadow-lg'>
        <div className='flex flex-col p-4 h-80'>
          <div className='flex'>
            <div className='text-2xl font-semibold text-building-block'>
              {buildingBlock.name}
            </div>
            {buildingBlock?.category &&
              <div className='ml-auto my-auto rounded bg-dial-lavender text-white'>
                <div className='text-sm px-1 py-1'>
                  {buildingBlock.category}
                </div>
              </div>
            }
          </div>
          <div className='block w-32 h-32 building-block-filter flex-grow mx-auto'>
            <Image
              fill
              className='object-contain'
              alt={format('image.alt.logoFor', { name: buildingBlock.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
            />
          </div>
        </div>
      </div>
      { buildingBlock.specUrl &&
        (<div className='p-3 lg:mr-6 text-dial-gray-dark text-sm'>
          {format('buildingBlock.specLink')}
          <a href={buildingBlock.specUrl} className='text-dial-blue text-sm' target='_blank' rel='noreferrer'>
            {buildingBlock.name}
          </a>
        </div>)
      }
    </>
  )
}

export default BuildingBlockDetailLeft

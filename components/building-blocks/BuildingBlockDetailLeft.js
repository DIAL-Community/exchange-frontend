import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import { DiscourseCount } from '../shared/discourse'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'

const BuildingBlockDetailLeft = ({ buildingBlock, discourseClick, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
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
        <div className='w-full flex gap-3'>
          {session?.user.canEdit && <EditButton type='link' href={generateEditLink()}/>}
          <button onClick={discourseClick}><DiscourseCount /></button>
        </div>
        <div className='h4 font-bold py-4'>{format('buildingBlock.label')}</div>
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 pr-2 text-building-block'>
            {buildingBlock.name}
          </div>
          <div className='m-auto align-middle w-40 building-block-filter'>
            <img
              alt={format('image.alt.logoFor', { name: buildingBlock.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
            />
          </div>
        </div>
      </div>
      { buildingBlock.specUrl && 
        (<div className='p-3 lg:mr-6 text-dial-gray-dark text-sm'>
          {format('building-block.spec-link')}
          <a href={buildingBlock.specUrl} className='text-dial-blue text-sm' target='_blank' rel='noreferrer'>
            {buildingBlock.name}
          </a>
        </div>)
      }
    </>
  )
}

export default BuildingBlockDetailLeft

import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import { DiscourseCount } from '../shared/discourse'

const BuildingBlockDetailLeft = ({ buildingBlock, discourseClick }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [session] = useSession()

  return (
    <>
      <div className='h-20'>
        <div className='w-full'>
        {session && 
            (<div className='inline'>
              {session.user.can_edit && (
              <button className='bg-dial-blue px-2 rounded text-white mr-5'>
                <img src='/icons/edit.svg' className='inline mr-2' alt='Edit' height='12px' width='12px' />
                <span className='text-sm p-2'>{format('app.edit')}</span>
              </button>)}
            </div>)}
          <button onClick={discourseClick}><DiscourseCount /></button>
        </div>
        <div className='h4 font-bold py-4'>{format('buildingBlock.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray mr-6 shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-80'>
            {buildingBlock.name}
          </div>
          <div className='m-auto align-middle w-40'>
            <img
              alt={`Logo for ${buildingBlock.name}`}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default BuildingBlockDetailLeft

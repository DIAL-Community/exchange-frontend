import Image from 'next/image'
import Link from 'next/link'

const BuildingBlockCard = ({buildingBlock, listType}) => {
  return(
    <Link href='/'>
      {listType === 'list' ? (
        <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center'>
          <div className='inline-block w-1/2 text-lg font-bold truncate '>
            <img className='inline pr-4' src={`${buildingBlock.imageUrl}`} alt={buildingBlock.imageUrl} width="30" height="30" />
            {buildingBlock.name}
          </div>
          <div className='inline-block w-1/4'>
            
          </div>
          <div className='inline-block font-bold w-1/4'>
            {buildingBlock.maturity}
          </div>
        </div>
      ) : (
        <div>Card View</div>
      )
      }
    </Link>
  )
}

export default BuildingBlockCard
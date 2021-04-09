import Link from 'next/link'

const BuildingBlockCard = ({ buildingBlock, listType }) => {
  return (
    <Link href={`/building-blocks/${buildingBlock.slug}`}>
      {listType === 'list'
        ? (
          <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex card-link'>
            <div className='inline-block w-1/2 text-lg font-bold truncate text-building-block flex items-center card-link-text'>
              <img className='inline pr-4 bb-filter' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}`} alt={buildingBlock.imageFile} width='40' height='40' />
              {buildingBlock.name}
            </div>
            <div className='inline-block w-1/2 mr-4 text-building-block text-sm flex justify-end items-center'>
              {buildingBlock.maturity}
            </div>
          </div>
          )
        : (
          <div>Card View</div>
          )}
    </Link>
  )
}

export default BuildingBlockCard

import Link from 'next/link'

const UseCaseCard = ({ useCase, listType }) => {
  return (
    <Link href={`/use-cases/${useCase.slug}`}>
      {listType === 'list'
        ? (
          <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center text-use-case card-link'>
            <div className='inline-block w-1/2 text-lg font-bold truncate card-link-text'>
              <img className='inline use-case-filter pr-4' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}`} alt={useCase.imageFile} width='40' height='40' />
              {useCase.name}
            </div>
            <div className='inline-block w-1/4' />
            <div className='inline-block font-bold w-1/4'>
              {useCase.maturity}
            </div>
          </div>
          )
        : (
          <div>Card View</div>
          )}
    </Link>
  )
}

export default UseCaseCard

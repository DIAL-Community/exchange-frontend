import Link from 'next/link'

const UseCaseCard = ({useCase, listType}) => {
  return(
    <Link href='/'>
      {listType === 'list' ? (
        <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center text-use-case'>
          <div className='inline-block w-1/2 text-lg font-bold truncate '>
            <img className='inline use-case-filter pr-4' src={`${useCase.imageUrl}`} alt={useCase.imageUrl} width="30" height="30" />
            {useCase.name}
          </div>
          <div className='inline-block w-1/4'>
            
          </div>
          <div className='inline-block font-bold w-1/4'>
            {useCase.maturity}
          </div>
        </div>
      ) : (
        <div>Card View</div>
      )
      }
    </Link>
  )
}

export default UseCaseCard
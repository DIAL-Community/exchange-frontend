import Image from 'next/image'
import Link from 'next/link'

const OrganizationCard = ({organization, listType}) => {
  return(
    <Link href='/'>
      {listType === 'list' ? (
        <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center'>
          <div className='inline-block w-2/3 text-lg font-bold truncate '>
            {organization.name}
          </div>
          <div className='inline-block w-1/4 right'>
            <img className='inline pr-4' src={`${organization.imageUrl}`} alt={organization.imageUrl} width="30" height="30" />
          </div>
        </div>
      ) : (
        <div>Card View</div>
      )
      }
    </Link>
  )
}

export default OrganizationCard
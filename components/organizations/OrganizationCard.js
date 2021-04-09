import Link from 'next/link'

const OrganizationCard = ({ organization, listType }) => {
  return (
    <Link className='card-link' href={`/organizations/${organization.slug}`}>
      {listType === 'list'
        ? (
          <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center card-link'>
            <div className='inline-block w-2/3 text-lg font-bold truncate card-link-text'>
              {organization.name}
            </div>
          </div>
          )
        : (
          <div>Card View</div>
          )}
    </Link>
  )
}

export default OrganizationCard

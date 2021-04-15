import Link from 'next/link'
import { useIntl } from 'react-intl'

const OrganizationCard = ({ organization, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <Link className='card-link' href={`/organizations/${organization.slug}`}>
      {listType === 'list'
        ? (
          <div className='border-3 border-transparent hover:border-dial-yellow text-button-gray hover:text-dial-yellow cursor-pointer'>
            <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
              <div className='flex justify-between my-4 px-4'>
                <div className='inline-block card-title truncate card-link-text'>
                  {organization.name}
                </div>
                { organization.isEndorser && 
                  <div className='inline-block mr-5 h5 flex self-end text-dial-blue'>
                    <img src='/icons/digiprins-logo.png' className='inline mr-2' alt='Digital Principles' height='20px' width='20px' />
                    {format('organization.endorsed-in')}&nbsp;{organization.whenEndorsed.substring(0,4)}
                  </div>
                }
              </div>
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

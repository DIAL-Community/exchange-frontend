import Link from 'next/link'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const OrganizationCard = ({ organization, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <Link className='card-link' href={`/organizations/${organization.slug}`}>
      {listType === 'list'
        ? (
          <div className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
            <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
              <div className='grid grid-cols-12 my-5 px-4'>
                <div className='col-span-4 text-base font-semibold text-dial-gray-dark'>
                  {truncate(organization.name, 40, true)}
                </div>
                <div className='col-span-6 text-base text-dial-gray-dark'>
                  {
                    organization.sectors && organization.sectors.length === 0 && format('general.na')
                  }
                  {
                    organization.sectors && organization.sectors.length > 0 &&
                      truncate(organization.sectors.map(u => u.name).join(', '), 100, true)
                  }
                </div>
                <div className='col-span-2 text-base text-dial-purple'>
                  {
                    !organization.whenEndorsed && (
                      <div className='flex flex-row text-sm font-semibold justify-end text-dial-cyan'>
                        {format('general.na')}
                      </div>
                    )
                  }
                  {
                    organization.whenEndorsed && (
                      <div className='flex flex-row text-sm font-semibold justify-end text-dial-cyan'>
                        <img className='mr-2 h-6' src='/icons/digiprins/digiprins.png' />
                        {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
                      </div>
                    )
                  }
                </div>
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

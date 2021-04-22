import Link from 'next/link'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const OrganizationCard = ({ organization, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <>
      {
        listType === 'list'
          ? (
            <Link className='card-link' href={`/organizations/${organization.slug}`}>
              <div className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
                <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                  <div className='grid grid-cols-12 my-5 px-4'>
                    <div className='col-span-4 text-base font-semibold text-dial-gray-dark whitespace-nowrap overflow-ellipsis overflow-hidden'>
                      {organization.name}
                    </div>
                    <div className='col-span-5 px-3 text-base text-dial-gray-dark whitespace-nowrap overflow-ellipsis overflow-hidden'>
                      {
                        organization.sectors && organization.sectors.length === 0 && format('general.na')
                      }
                      {
                        organization.sectors && organization.sectors.length > 0 &&
                          organization.sectors.map(u => u.name).join(', ')
                      }
                    </div>
                    <div className='col-span-3 text-base text-dial-purple'>
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
            </Link>
            )
          : (
            <div className='group border-3 border-transparent hover:border-dial-yellow text-dial-purple cursor-pointer'>
              <div className='h-full flex flex-col border border-dial-gray hover:border-dial-yellow shadow-lg hover:shadow-2xl'>
                {
                  organization.whenEndorsed && (
                    <div className='flex flex-row p-1.5 border-b border-dial-gray text-sm font-semibold justify-end text-dial-cyan'>
                      <img className='mr-2 h-6' src='/icons/digiprins/digiprins.png' />
                      <div className='my-auto'>
                        {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
                      </div>
                    </div>
                  )
                }
                <Link className='card-link' href={`/organizations/${organization.slug}`}>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-80 group-hover:text-dial-yellow '>
                      {truncate(organization.name, 40, true)}
                    </div>
                    <div className='m-auto align-middle w-40'>
                      <img
                        alt={`Logo for ${organization.name}`}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                      />
                    </div>
                  </div>
                </Link>
                <div className='bg-dial-blue hover:bg-dial-yellow text-white mt-auto'>
                  <div className='border-b border-dial-gray'>
                    <div className='py-3'>
                      <a href={`//${organization.website}`} className='flex flex-row justify-center' target='_blank' rel='noreferrer'>
                        <div className='my-auto'>Visit website</div>
                        <img className='ml-2 h-5' src='/icons/visit-light/visit-light.png' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
      }
    </>
  )
}

export default OrganizationCard

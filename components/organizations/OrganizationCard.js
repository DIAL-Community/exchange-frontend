import Link from 'next/link'
import { useIntl } from 'react-intl'
import { convertToKey } from '../context/FilterContext'

const collectionPath = convertToKey('Organizations')

const ellipsisTextStyle = `
  whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-organization hover:text-dial-yellow
`

const OrganizationCard = ({ organization, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      {
        listType === 'list'
          ? (
            <Link data-testid='org-card' className='card-link' href={`/${collectionPath}/${organization.slug}`}>
              <a {...newTab && { target: '_blank' }}>
                <div className={containerElementStyle}>
                  <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                    <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4' style={{ minHeight: '4.5rem' }}>
                      <div className={`w-10/12 lg:w-4/12 text-base font-semibold text-dial-gray-dark my-auto  ${ellipsisTextStyle}`}>
                        <img
                          className='inline pr-3 w-8'
                          alt={format('image.alt.logoFor', { name: organization.name })}
                          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                        />
                        {organization.name}
                      </div>
                      {
                        organization.sectors &&
                          <div className={`w-10/12 lg:w-5/12 text-base text-dial-gray-dark ${ellipsisTextStyle}`}>
                            {organization.sectors.length === 0 && format('general.na')}
                            {organization.sectors.length > 0 && organization.sectors.map(u => u.name).join(', ')}
                          </div>
                      }
                      <div
                        className={`
                          absolute top-2 lg:top-1/3 right-4 flex flex-nowrap gap-x-1.5
                          lg:w-2/12 lg:justify-end
                        `}
                      >
                        {
                          !organization.whenEndorsed && (
                            <div className='text-sm font-semibold text-dial-cyan text-right'>
                              {format('general.na')}
                            </div>
                          )
                        }
                        {
                          organization.whenEndorsed && (
                            <div className='text-sm font-semibold text-dial-cyan text-right'>
                              <img
                                alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                                className='inline mr-2 h-6 ml-auto' src='/icons/digiprins/digiprins.png'
                              />
                              <span className='hidden lg:inline'>
                                {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
                              </span>
                              <span className='inline lg:hidden'>
                                {`${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
                              </span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )
          : (
            <div data-testid='org-card' className={`group ${containerElementStyle}`}>
              <div className='flex flex-col border border-dial-gray hover:border-dial-yellow card-drop-shadow'>
                <div>
                  <div className='flex justify-between p-1.5 border-b border-dial-gray text-sm font-semibold text-dial-cyan'>
                    <div className='flex flex-row gap-x-2 h-6'>
                      {
                        organization.whenEndorsed &&
                          <img
                            alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                            src='/icons/digiprins/digiprins.png'
                          />
                      }
                      <div className='my-auto'>
                        {
                          organization.whenEndorsed &&
                            `${format('organization.endorsedOn')} ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()
                        }
                      </div>
                      {organization.endorserLevel === 'gold' && (
                        <div className='ml-auto bg-dial-yellow rounded px-2 py-1 text-white text-sm font-semibold'>
                          {organization.endorserLevel && organization.endorserLevel.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={`/${collectionPath}/${organization.slug}`} passHref>
                  <div className='flex flex-col h-80 p-4'>
                    <div
                      className={`
                        text-2xl font-semibold group-hover:text-dial-yellow w-64 2xl:w-80
                        text-ellipsis overflow-hidden
                      `}
                    >
                      {organization.name}
                    </div>
                    <div className='m-auto'>
                      <img
                        className='w-40'
                        alt={format('image.alt.logoFor', { name: organization.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                      />
                    </div>
                  </div>
                </Link>
                {
                  organization.website &&
                    <div className='bg-dial-blue hover:bg-dial-yellow text-white mt-auto'>
                      <div className='py-3'>
                        <a
                          href={`//${organization.website}`} className='flex flex-row justify-center'
                          target='_blank' rel='noreferrer'
                        >
                          <div className='my-auto'>{format('organization.visitWebsite')}</div>
                          <img
                            alt={format('image.alt.logoFor', { name: format('visitWebsite.title') })}
                            className='ml-2 h-5' src='/icons/visit-light/visit-light.png'
                          />
                        </a>
                      </div>
                    </div>
                }
              </div>
            </div>
          )
      }
    </>
  )
}

export default OrganizationCard

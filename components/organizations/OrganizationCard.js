import Link from 'next/link'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { ToastContext } from '../../lib/ToastContext'
import { convertToKey } from '../context/FilterContext'

const collectionPath = convertToKey('Organizations')

const ellipsisTextStyle = `
  whitespace-nowrap overflow-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-organization hover:text-dial-yellow
`

const OrganizationCard = ({ organization, listType, filterDisplayed, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { showToast } = useContext(ToastContext)
  const navClickHandler = (target) => {
    showToast(`${format('app.openingDetails')} ...`, 'default', 'bottom-right', false)
  }

  const nameColSpan = (organization) => {
    return !organization.sectors
      ? 'col-span-8'
      : filterDisplayed ? 'col-span-8 md:col-span-6 xl:col-span-3' : 'col-span-8 md:col-span-7 lg:col-span-3'
  }

  return (
    <>
      {
        listType === 'list'
          ? (
            <Link className='card-link' href={`/${collectionPath}/${organization.slug}`}>
              <a {...newTab && { target: '_blank' }}>
                <div onClick={() => navClickHandler()} className={containerElementStyle}>
                  <div className='bg-white border border-dial-gray hover:border-transparent drop-shadow'>
                    <div className='grid grid-cols-12 gap-x-4 py-4 px-4'>
                      <img
                        className='m-auto w-8'
                        alt={format('image.alt.logoFor', { name: organization.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                      />
                      <div
                        className={`
                          ${nameColSpan(organization)} text-base font-semibold text-dial-gray-dark
                          my-auto whitespace-nowrap overflow-ellipsis overflow-hidden my-auto
                        `}
                      >
                        {organization.name}
                        {
                          organization.sectors &&
                            <div className={`block ${filterDisplayed ? ' xl:hidden' : 'lg:hidden'} flex flex-row mt-1`}>
                              <div className='text-sm font-normal'>
                                {format('sector.header')}:
                              </div>
                              <div className='text-sm font-normal overflow-hidden overflow-ellipsis'>
                                {organization.sectors.length === 0 && format('general.na')}
                                {
                                  organization.sectors.length > 0 &&
                                  organization.sectors.map(u => u.name).join(', ')
                                }
                              </div>
                            </div>
                        }
                      </div>
                      {
                        organization.sectors &&
                          <div className={`
                            hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                            col-span-5 text-base text-dial-gray-dark ${ellipsisTextStyle}`}
                          >
                            {organization.sectors.length === 0 && format('general.na')}
                            {
                              organization.sectors.length > 0 &&
                                organization.sectors.map(u => u.name).join(', ')
                            }
                          </div>
                      }
                      <div className='col-span-4 lg:col-span-3 text-base text-dial-purple my-auto'>
                        {
                          !organization.whenEndorsed && (
                            <div className='text-sm font-semibold text-dial-cyan text-right'>
                              {format('general.na')}
                            </div>
                          )
                        }
                        {
                          organization.whenEndorsed && (
                            <div className='flex flex-row text-sm font-semibold text-dial-cyan text-right'>
                              <img
                                alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                                className='mr-2 h-6 ml-auto' src='/icons/digiprins/digiprins.png'
                              />
                              {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
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
            <div onClick={() => navClickHandler()} className={`group ${containerElementStyle}`}>
              <div className='h-full flex flex-col border border-dial-gray hover:border-dial-yellow drop-shadow'>
                {
                  organization.whenEndorsed && (
                    <div>
                      <div className='flex justify-between p-1.5 border-b border-dial-gray text-sm font-semibold text-dial-cyan'>
                        <div className='flex flex-col'>
                          <div className='flex flex-row'>
                            <img
                              alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                              className='mr-2 h-6' src='/icons/digiprins/digiprins.png'
                            />
                            <div className='my-auto'>
                              {`${format('organization.endorsedOn')} ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-col'>
                          {organization.endorserLevel === 'gold' && (
                            <div className='ml-auto bg-dial-yellow rounded px-2 py-1 text-white text-sm font-semibold'>
                              {organization.endorserLevel.toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                }
                <Link className='card-link' href={`/${collectionPath}/${organization.slug}`}>
                  <div className='flex flex-col h-80 p-4'>
                    <div
                      className={`
                        text-2xl font-semibold group-hover:text-dial-yellow w-64 2xl:w-80 bg-white bg-opacity-70
                        overflow-ellipsis overflow-hidden
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
                      <div className='border-b border-dial-gray'>
                        <div className='py-3'>
                          <a href={`//${organization.website}`} className='flex flex-row justify-center' target='_blank' rel='noreferrer'>
                            <div className='my-auto'>{format('organization.visitWebsite')}</div>
                            <img
                              alt={format('image.alt.logoFor', { name: format('visitWebsite.title') })}
                              className='ml-2 h-5' src='/icons/visit-light/visit-light.png'
                            />
                          </a>
                        </div>
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

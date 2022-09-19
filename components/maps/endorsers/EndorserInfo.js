import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'

const EndorserInfo = (props) => {
  const { city, setOrganization } = props

  const router = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [active, setActive] = useState(city?.organizations[0].slug)

  // Just return empty fragment when there's no city selected.
  if (!city) {
    return null
  }

  const openDetailPage = (e, slug) => {
    e.preventDefault()
    router.push(`/organizations/${slug}`)
  }

  const toggleExpand = (e, organization) => {
    e.preventDefault()
    setOrganization(organization)
    setActive(active === organization.slug ? 'undefined' : organization.slug)
  }

  return (
    <div className='absolute left-4 md:left-auto right-4' style={{ zIndex: 19, minWidth: '20ch' }}>
      <div className='block mt-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-w-prose'>
        <div className='text-sm text-dial-cyan font-semibold border-b px-4 py-2'>
          {`${city.organizations.length} ${format('organization.header')}`}
        </div>
        {
          city && city.organizations.map(organization => {
            return (
              <div key={`${city.name}-${organization.name}`} className='hover:bg-gray-100 hover:text-gray-900'>
                <div className='mx-4 py-2 border-b last:border-0'>
                  <a
                    href={`expand-${organization.slug}`} onClick={(e) => toggleExpand(e, organization)}
                    className={`${active === organization.slug ? 'font-semibold' : ''} text-sm text-gray-700 cursor-pointer block`}
                  >
                    {organization.name}
                  </a>
                  {
                    active === organization.slug &&
                      <>
                        <div className='flex flex-col'>
                          <div className='flex flex-row'>
                            {
                              organization.website &&
                                <div className='text-xs flex-grow text-dial-blue my-2'>
                                  <a href={`//${organization.website}`} target='_blank' rel='noreferrer'>
                                    {organization.website} ⧉
                                  </a>
                                </div>
                            }
                            {
                              organization.whenEndorsed &&
                                <div className='flex flex-row p-1.5 text-xs font-semibold justify-end text-dial-cyan'>
                                  <img
                                    alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                                    className='mr-2 h-6' src='/icons/digiprins/digiprins.png'
                                  />
                                  <div className='my-auto'>
                                    {`${format('endorsement.year.text')} ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
                                  </div>
                                </div>
                            }
                          </div>
                          <a
                            href={organization.slug} onClick={(e) => openDetailPage(e, organization.slug)}
                            className='py-1.5 text-center text-xs text-dial-blue bg-dial-blue-light bg-opacity-20 cursor-pointer'
                          >
                            {format('map.endorsers.viewOrganization')} &gt;&gt;
                          </a>
                        </div>
                      </>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default EndorserInfo

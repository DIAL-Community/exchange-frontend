import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { prependUrlWithProtocol } from '../../utils/utilities'

const EndorserInfo = ({ city, setOrganization }) => {
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
    <div className='absolute left-4 md:left-auto right-4' style={{ zIndex: 19, minWidth: '32ch' }}>
      <div className='bg-white max-w-prose'>
        <div className='text-sm text-dial-plum font-semibold border-b px-4 py-2'>
          {`${city.organizations.length} ${format('ui.organization.header')}`}
        </div>
        {city && city.organizations.map((organization, index) => {
          return (
            <div key={index} className={`text-sm ${index % 2 === 1 && 'bg-dial-violet'}`}>
              <div className='flex flex-col border-b last:border-0'>
                <a
                  href={`expand-${organization.slug}`}
                  onClick={(e) => toggleExpand(e, organization)}
                  className={classNames(
                    active === organization.slug ? 'font-semibold' : '',
                    'cursor-pointer'
                  )}
                >
                  <div className='px-4 py-2'>
                    {organization.name}
                  </div>
                </a>
                {active === organization.slug &&
                  <div className='flex flex-col text-xs'>
                    {organization.website &&
                      <a href={prependUrlWithProtocol(organization.website)} target='_blank' rel='noreferrer'>
                        <div className='px-4 py-2 text-dial-iris-blue'>
                          {organization.website}
                          &nbsp;⧉
                        </div>
                      </a>
                    }
                    {organization.whenEndorsed &&
                      <div className='flex flex-row gap-x-1 px-4'>
                        <img
                          className='w-6 h-6'
                          alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                          src='/icons/digiprins/digiprins.png'
                        />
                        <div className='my-auto italic'>
                          {`${format('endorsement.year.text')} ${organization.whenEndorsed.substring(0, 4)}`}
                        </div>
                      </div>
                    }
                    <a
                      href={organization.slug}
                      onClick={(e) => openDetailPage(e, organization.slug)}
                      className='py-2 px-4 text-center text-dial-iris-blue'
                    >
                      {format('map.endorsers.viewOrganization')} &gt;&gt;
                    </a>
                  </div>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EndorserInfo

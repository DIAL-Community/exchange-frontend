import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FaLinkedin, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { HUB_CONTACTS_QUERY } from '../../shared/query/contact'
import { allowedToBrowseAdliPages } from '../admin/utilities'
import HubPagination from '../fragments/HubPagination'
import {
  FACEBOOK_SOCIAL_MEDIA_TYPE, INSTAGRAM_SOCIAL_MEDIA_TYPE, LINKEDIN_SOCIAL_MEDIA_TYPE, TWITTER_X_SOCIAL_MEDIA_TYPE
} from '../user/constant'

const HubExpertNetwork = () => {
  const { user } = useUser()
  const [currentView, setCurrentView] = useState('adli-current')

  const [loadNetworkMembers, { loading, error, data }] = useLazyQuery(HUB_CONTACTS_QUERY, {
    variables: {
      alumni: currentView !== 'adli-current'
    }
  })

  const toggleCurrentView = (view) => {
    setCurrentView(view)
    loadNetworkMembers({
      variables: {
        type: view
      },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    })
  }

  const signInUser = (e) => {
    e.preventDefault()
    signIn()
  }

  useEffect(() => {
    loadNetworkMembers({
      variables: {
        alumni: currentView !== 'adli-current'
      },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    })
  }, [currentView, loadNetworkMembers])

  const renderErrorMessage = () => {
    return <FormattedMessage id='general.fetchError' />
  }

  const renderNetworkMembers = () => {
    return data?.hubContacts
      ? <NetworkMembers members={data?.hubContacts} />
      : <FormattedMessage id='ui.general.error.notFound' />
  }

  const handleGraphQuery = () => {
    if (loading) {
      return <FormattedMessage id='general.fetchingData' />
    } else if (error) {
      return renderErrorMessage()
    } else {
      return renderNetworkMembers()
    }
  }

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog mx-auto  min-h-[80vh]'>
      <img
        className='h-32 w-full object-cover'
        alt='DIAL Resource Hub - ADLI Network'
        src='/images/hero-image/hub-adli-network.svg'
      />
      <div className='absolute w-full left-1/2 -translate-x-1/2' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto py-12'>
          <div className='text-2xl px-4 lg:px-8 xl:px-24 3xl:px-56 text-dial-gray'>
            ADLI Network
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className='flex flex-col gap-12'>
          <div className='flex flex-col 2xl:flex-row gap-6'>
            <div className='text-justify 2xl:max-w-4xl line-clamp-6'>
              <FormattedMessage
                id='hub.adliNetwork.subtitle'
                values={{
                  break: () => <br />
                }}
              />
            </div>
            <div className='ml-auto mb-auto flex flex-row align-top gap-4'>
              <a
                target='_blank'
                rel='noreferrer'
                href='//dial.global/work/adli/'
                className='flex border-b border-transparent hover:border-dial-yellow'
              >
                <FormattedMessage id='hub.exportNetwork.learnMore' />
              </a>
              {user && allowedToBrowseAdliPages(user) && (
                <>
                  <div className='border-r border-dial-slate-500' />
                  <Link href='/hub/dashboard' className='flex'>
                    <span className='border-b border-transparent hover:border-dial-yellow'>
                      <FormattedMessage id='hub.exportNetwork.memberDashboard' />
                    </span>
                  </Link>
                </>
              )}
              {!user && (
                <>
                  <div className='border-r border-dial-slate-500' />
                  <Link href='/hub/member-login' onClick={signInUser} className='flex'>
                    <span className='border-b border-transparent hover:border-dial-yellow'>
                      <FormattedMessage id='hub.exportNetwork.login' />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className='mb-4 border-b border-dial-gray-200'>
            <ul
              role='tablist'
              id='default-tab'
              className='flex flex-wrap items-center justify-center -mb-px font-medium text-center'
              data-tabs-toggle='#tab-content'
            >
              <li className='me-2' role='presentation'>
                <button
                  role='tab'
                  id='adli-current'
                  className={classNames(
                    'px-5 py-3',
                    'inline-block border-b-2 rounded-t-lg',
                    'text-dial-deep-purple border-dial-deep-purple',
                    currentView === 'adli-current'
                      ? 'opacity-100'
                      : 'opacity-30 hover:opacity-100'
                  )}
                  onClick={() => toggleCurrentView('adli-current')}
                >
                  ADLI Current
                </button>
              </li>
              <li role='presentation'>
                <button
                  role='tab'
                  id='adli-alumni'
                  className={classNames(
                    'px-5 py-3',
                    'inline-block border-b-2 rounded-t-lg',
                    'text-dial-deep-purple border-dial-deep-purple',
                    currentView === 'adli-alumni'
                      ? 'opacity-100'
                      : 'opacity-30 hover:opacity-100'
                  )}
                  onClick={() => toggleCurrentView('adli-alumni')}
                >
                  ADLI Alumni
                </button>
              </li>
            </ul>
          </div>
          <div id='tab-content'>
            {currentView === 'adli-current' &&
              <div
                role='tabpanel'
                id='adli-current'
                aria-labelledby='adli-current'
                className='p-4 rounded-lg bg-gray-50'
              >
                {handleGraphQuery()}
              </div>
            }
            {currentView === 'adli-alumni' &&
              <div
                role='tabpanel'
                id='adli-alumni'
                aria-labelledby='adli-alumni'
                className='p-4 rounded-lg bg-gray-50'
              >
                {handleGraphQuery()}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const NetworkMembers = ({ members }) => {
  const DEFAULT_PAGE_COUNT = 12
  const [pageNumber, setPageNumber] = useState(0)

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-12'>
        {members
          .slice(pageNumber * DEFAULT_PAGE_COUNT, (pageNumber + 1) * DEFAULT_PAGE_COUNT)
          .map((member, index) => (
            <NetworkMemberCard key={index} member={member} />
          ))
        }
      </div>
      <HubPagination
        onClickHandler={onClickHandler}
        pageNumber={pageNumber}
        totalCount={members.length}
        defaultPageSize={DEFAULT_PAGE_COUNT}
        theme={'dark'}
      />
    </>
  )
}

const NetworkMemberCard = ({ member }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const country = member.extraAttributes.find((attr) => attr.name === 'country')
  const countryCode = member.extraAttributes.find((attr) => attr.name === 'country-slug')
  const organization = member.extraAttributes.find((attr) => attr.name === 'organization')
  const years = member.extraAttributes.find((attr) => attr.name === 'adli-years')

  return (
    <div className='flex items-center gap-4'>
      <div className='h-24 w-24 2xl:h-32 2xl:w-32 shrink-0'>
        <img
          alt={format('hub.adliNetwork.memberCard.alt')}
          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + member.imageFile}
          className='rounded-full object-cover h-full w-full'
        />
      </div>
      <div className='grow flex flex-col gap-1'>
        <div className='text-lg font-bold'>
          {member.name}
        </div>
        <div className='text-sm'>{member.title}</div>
        <div className='text-sm'>{organization?.value}</div>
        <div className='text-sm'>{`Cohort: ${years?.value.join(', ')}`}</div>
        {country?.value &&
          <div className='flex gap-1 items-center'>
            {countryCode?.value &&
              <img
                src={`https://flagsapi.com/${countryCode?.value.toUpperCase()}/flat/64.png`}
                alt={format('ui.country.logoAlt', { countryName: country.code })}
                className='object-contain w-6	h-6'
              />
            }
            <div className='text-sm'>{country?.value}</div>
          </div>
        }
        {member.socialNetworkingServices.length > 0 &&
          <div className='flex gap-1'>
            {member.socialNetworkingServices
              .filter(service => service.value !== 'phone')
              .map((service, index) => (
                <div key={index} className='text-sm'>
                  <a
                    className='flex'
                    target='_blank'
                    rel='noreferrer'
                    href={`//${service.value}`}
                  >
                    <div aria-label={service.name} className='text-dial-sapphire'>
                      {service.name === LINKEDIN_SOCIAL_MEDIA_TYPE ? <FaLinkedin size='1.5rem' /> : null}
                      {service.name === TWITTER_X_SOCIAL_MEDIA_TYPE ? <FaSquareXTwitter size='1.5rem' /> : null}
                      {service.name === INSTAGRAM_SOCIAL_MEDIA_TYPE ? <FaSquareInstagram size='1.5rem' /> : null}
                      {service.name === FACEBOOK_SOCIAL_MEDIA_TYPE ? <FaSquareFacebook size='1.5rem' /> : null}
                    </div>
                  </a>
                </div>
              ))}
          </div>
        }
      </div>
    </div>
  )
}

export default HubExpertNetwork

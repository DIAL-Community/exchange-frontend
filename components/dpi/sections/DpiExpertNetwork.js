import { useCallback } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FaLinkedin, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { HUB_CONTACTS_QUERY } from '../../shared/query/contact'

const DpiExpertNetwork = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const signInUser = (e) => {
    e.preventDefault()
    signIn()
  }

  // https://stackoverflow.com/a/2450976/4351257
  const shuffle = (array) => {
    let shuffledArray = [...array]
    let currentIndex = array.length

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex], shuffledArray[currentIndex]
      ]
    }

    return shuffledArray
  }

  const { loading, error, data } = useQuery(HUB_CONTACTS_QUERY, {
    variables: {}
  })

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='flex gap-8 justify-center mx-auto py-20'>
          <div className='text-2xl text-center text-dial-cotton  max-w-prose'>
            <FormattedMessage
              id='dpi.expertNetwork.subtitle'
              values={{
                break: () => <br />
              }}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <a
              target='_blank'
              rel='noreferrer'
              href='//dial.global/work/adli/'
              className='text-dial-cotton border-b border-transparent hover:border-white'
            >
              <FormattedMessage id='dpi.exportNetwork.learnMore' />
            </a>
            {user && (
              <Link href='/dpi-dashboard' className='flex'>
                <span className='text-dial-cotton border-b border-transparent hover:border-white'>
                  <FormattedMessage id='dpi.exportNetwork.memberDashboard' />
                </span>
              </Link>
            )}
            {!user && (
              <Link href='/dpi-member-login' onClick={signInUser} className='flex'>
                <span className='text-dial-cotton border-b border-transparent hover:border-white'>
                  <FormattedMessage id='dpi.exportNetwork.login' />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56  min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {loading
            ? format('general.fetchingData')
            : error
              ? format('general.fetchError')
              : data
                ? shuffle(data.hubContacts)
                  .filter((object, index) => index < 12 )
                  .map((member, index) => <NetworkMemberCard key={index} member={member} />)
                : format('general.noData')
          }
        </div>
      </div>
    </div>
  )
}

const NetworkMemberCard = ({ member }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex items-center gap-4'>
      {member?.imageFile.indexOf('placeholder') < 0 &&
        <div className="h-32 w-32 shrink-0">
          <img
            alt={format('dpi.expertNetwork.memberCard.alt')}
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + member.imageFile}
            className="rounded-full object-cover h-full w-full"
          />
        </div>
      }
      {!member?.imageFile.indexOf('placeholder') >= 0 &&
        <div className="h-24 w-24 flex justify-center items-center rounded-full bg-dial-sapphire shrink-0">
          <img
            alt={format('dpi.expertNetwork.memberCard.alt')}
            src='/ui/v1/user-alt-placeholder.svg'
            className="p-8 font-thin white-filter"
          />
        </div>
      }
      <div className='grow flex flex-col gap-1'>
        <span className='text-lg font-bold'>
          {member.name}
        </span>
        <span className='text-sm'>{member.title}</span>
        {member.socialNetworkingServices.length > 0 &&
          <div className='flex gap-1'>
            {member.socialNetworkingServices
              .filter(service => service.value !== 'phone')
              .map((service, index) => (
                <span key={index} className='text-sm'>
                  <a
                    className='flex'
                    target='_blank'
                    rel='noreferrer'
                    href={`//${service.value}`}
                  >
                    <div aria-label={service.name}>
                      {service.name === 'linkedin' ? <FaLinkedin size='1.5rem' className='text-dial-sapphire' /> : null}
                      {service.name === 'twitter' ? <FaSquareXTwitter size='1.5rem' /> : null}
                      {service.name === 'instagram' ? <FaSquareInstagram size='1.5rem' /> : null}
                      {service.name === 'facebook' ? <FaSquareFacebook size='1.5rem' /> : null}
                    </div>
                  </a>
                </span>
              ))}
          </div>
        }
      </div>
    </div>
  )
}

export default DpiExpertNetwork

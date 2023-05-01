import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { convertToKey } from '../context/FilterContext'
import { getOpportunityStatusBgColor, prependUrlWithProtocol } from '../../lib/utilities'

const collectionPath = convertToKey('Opportunities')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const OpportunityCard = ({ opportunity, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const createOpportunityBadges = (opportunity) =>
    <div className={`${listType === 'card' ? 'relative' : 'flex gap-3 ml-auto'} text-xs`}>
      {opportunity.opportunityStatus &&
        <div className={`${listType === 'card' && 'absolute top-2 left-2'} text-white`}>
          <div className={`px-2 py-1 rounded ${getOpportunityStatusBgColor(opportunity)}`}>
            {opportunity.opportunityStatus}
          </div>
        </div>
      }
      {// Placing the information icon on the top right of the image and name.
        opportunity.opportunityType &&
          <div className={`${listType === 'card' && 'absolute top-2 right-2'} my-auto`}>
            {opportunity.opportunityType}
          </div>
      }
    </div>

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className={`${containerElementStyle}`}>
              <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
                <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4'>
                  <Link href={`/${collectionPath}/${opportunity.slug}`}>
                    <a className='flex-grow flex gap-3 px-4 py-3 lg:py-6' {...newTab && { target: '_blank' }}>
                      <div className='text-dial-gray-dark my-auto'>
                        <div className='image-block-hack w-8 relative'>
                          <Image
                            layout='fill'
                            objectFit='scale-down'
                            objectPosition='left'
                            alt={format('image.alt.logoFor', { name: opportunity.name })}
                            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
                          />
                        </div>
                        <div className='ml-2 mt-0.5 w-full h-3/5 font-semibold line-clamp-1'>
                          {opportunity.name}
                        </div>
                      </div>
                      {createOpportunityBadges(opportunity)}
                    </a>
                  </Link>
                  {opportunity.webAddress &&
                    <div className='w-full lg:w-2/12 pb-3 lg:pb-0 px-6 my-auto'>
                      <div className='text-dial-sunshine text-sm flex'>
                        <a
                          href={prependUrlWithProtocol(opportunity.webAddress)}
                          className='flex flex-row justify-center'
                          target='_blank' rel='noreferrer'
                        >
                          <div className='flex gap-2'>
                            {opportunity.webAddress}
                            <FaExternalLinkAlt className='my-auto' />
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          )
          : (
            <div data-testid='opportunity-card' className={`group ${containerElementStyle}`}>
              <div
                className={classNames(
                  'bg-white shadow-lg rounded-lg h-full',
                  'border border-dial-gray hover:border-transparent'
                )}
              >
                <div className='flex flex-col'>
                  {createOpportunityBadges(opportunity)}
                  <Link href={`/${collectionPath}/${opportunity.slug}`}>
                    <div className='flex flex-col'>
                      <div className='flex text-dial-sapphire bg-dial-alice-blue h-24 rounded-t-lg'>
                        <div className='px-4 text-sm text-center font-semibold m-auto line-clamp-1'>
                          {opportunity.name}
                        </div>
                      </div>
                      <div className='my-8 mx-auto'>
                        <div className='block w-64 h-32 relative'>
                          <Image
                            layout='fill'
                            objectFit='scale-down'
                            alt={format('image.alt.logoFor', { name: opportunity.name })}
                            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
                          />
                        </div>
                      </div>
                      <div className='bg-dial-alice-blue h-28'>
                        <div className='px-3 py-3 text-sm line-clamp-4'>
                          <div className='line-clamp-4'>
                            {parse(opportunity?.description)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <hr />
                  <div className='bg-dial-alice-blue pt-3'>
                    <div className='flex flex-col px-3 pb-3 text-sm gap-1 mt-auto'>
                      <div className='font-semibold'>{format('opportunity.webAddress')}</div>
                      <div className='text-sm'>
                        {opportunity.webAddress && opportunity.webAddress !== 'N/A'
                          ? <a
                            href={prependUrlWithProtocol(opportunity.webAddress)}
                            target='_blank' rel='noreferrer'
                            className='text-dial-sunshine'
                          >
                            <div className='line-clamp-1 border-b border-transparent hover:border-dial-sunshine'>
                              {opportunity.webAddress} ⧉
                            </div>
                          </a>
                          : format('general.na')
                        }
                      </div>
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

export default OpportunityCard

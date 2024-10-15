import { useCallback } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../utils/utilities'

const collectionPath = 'Organizations'.replace(/\s+/g, '_').toLowerCase()

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const OrganizationCard = ({ organization, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const listDisplayType = () =>
    <div className={`${containerElementStyle}`}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-6/12 flex gap-3 text-dial-gray-dark my-auto'>
            <div className='block w-8 relative'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: organization.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              />
            </div>
            <div className='ml-2 mt-0.5 w-full h-3/5 font-semibold line-clamp-1'>
              {organization.name}
            </div>
          </div>
          <div className='ml-auto text-sm lg:text-base my-auto text-dial-purple line-clamp-1'>
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
                    {`${format('organization.endorsedOn')}
                      ${organization.whenEndorsed.substring(0, 4)}
                      `.toUpperCase()}
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

  const cardDisplayType = () =>
    <div className={`group ${containerElementStyle}`}>
      <div className='bg-white shadow-lg rounded-lg h-full border-t'>
        <div className='flex flex-col'>
          <div className='relative'>
            <div className='absolute top-2 left-2'>
              <div className='flex gap-2 text-xs font-semibold'>
                {organization.whenEndorsed &&
                  <div className='w-4 my-auto image-block-hack'>
                    <Image
                      width={25}
                      height={25}
                      alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                      src='/icons/digiprins/digiprins.png'
                    />
                  </div>
                }
                <div className='my-auto'>
                  {organization.whenEndorsed && `
                      ${format('organization.endorsedOn')}
                      ${organization.whenEndorsed.substring(0, 4)}
                    `.toUpperCase()
                  }
                </div>
                {organization.endorserLevel === 'gold' && (
                  <div className='text-dial-gray-dark'>
                    {organization.endorserLevel && organization.endorserLevel.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link href={`/${collectionPath}/${organization.slug}`}>
            <div className='flex flex-col'>
              <div className='flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg'>
                <div className='px-4 text-sm text-center font-semibold m-auto'>
                  {organization.name}
                </div>
              </div>
              <div className='mx-auto py-6'>
                <img
                  className='object-contain h-28 w-20'
                  layout='fill'
                  alt={format('image.alt.logoFor', { name: organization.name })}
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                />
              </div>
            </div>
          </Link>
          {organization.website &&
            <div className='bg-dial-biscotti hover:bg-dial-sunshine text-white mt-auto text-sm rounded-b-md'>
              <a
                href={prependUrlWithProtocol(organization.website)}
                className='flex flex-row justify-center'
                target='_blank'
                rel='noreferrer'
              >
                <div className='py-3 flex gap-2'>
                  {format('organization.visitWebsite')}
                  <FaExternalLinkAlt className='my-auto' />
                </div>
              </a>
            </div>
          }
        </div>
      </div>
    </div>

  return (
    listType === 'list'
      ? newTab
        ? <Link href={`/${collectionPath}/${organization.slug}`}>
          {listDisplayType()}
        </Link>
        : <a href={`/${collectionPath}/${organization.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
          {listDisplayType()}
        </a>
      : cardDisplayType()
  )
}

export default OrganizationCard

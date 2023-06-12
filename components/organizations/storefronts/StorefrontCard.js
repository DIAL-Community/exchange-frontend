import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../lib/utilities'
import { convertToKey } from '../../context/FilterContext'

const collectionPath = convertToKey('Storefronts')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const StorefrontCard = ({ organization, displayType, newTab = false }) => {
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
            {organization?.specialties?.length > 0 &&
              <div className='text-dial-gray-dark bg-white px-2 py-1 rounded'>
                {`${organization.specialties.length}
                  ${organization.specialties.length > 1 ? format('specialty.header') : format('specialty.label')}
                `}
              </div>
            }
          </div>
        </div>
      </div>
    </div>

  const cardDisplayType = () =>
    <div data-testid='org-card' className={`group ${containerElementStyle}`}>
      <div className='bg-white shadow-lg rounded-lg h-full border'>
        <div className='flex flex-col'>
          <Link href={`/${collectionPath}/${organization.slug}`}>
            <div className='flex flex-col'>
              <div className='flex text-dial-sapphire bg-dial-solitude h-28 rounded-t-lg'>
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
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {organization.specialties.length > 0 ? organization.specialties.length : '-' }
              </span>
              <span className='my-auto'>
                {organization.specialties.length > 1 ? format('specialty.header') : format('specialty.label')}
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {organization.certifications.length > 0 ? organization.certifications.length : '-' }
              </span>
              <span className='my-auto'>
                {organization.certifications.length > 1 ? format('certification.header') : format('certification.label')}
              </span>
            </div>
          </div>
          {organization.website &&
            <div className='bg-dial-biscotti hover:bg-dial-sunshine text-white mt-auto rounded-b-md'>
              <a
                href={prependUrlWithProtocol(organization.website)}
                className='flex flex-row justify-center text-sm'
                target='_blank' rel='noreferrer'
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
    displayType === 'list'
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

export default StorefrontCard

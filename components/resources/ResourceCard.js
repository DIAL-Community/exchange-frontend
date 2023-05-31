import Link from 'next/link'
import Image from 'next/image'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { convertToKey } from '../context/FilterContext'
import { prependUrlWithProtocol } from '../../lib/utilities'

const collectionPath = convertToKey('Resources')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const ResourceCard = ({ resource, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const listDisplayType = () =>
    <div className={containerElementStyle}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
            <div className='block w-8 relative opacity-60'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: resource.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
              />
            </div>
            <div className='w-full font-semibold'>
              {resource.name}
            </div>
          </div>
        </div>
      </div>
    </div>

  const cardDisplayType = () =>
    <div className={containerElementStyle}>
      <div className='bg-white shadow-lg rounded-lg h-full'>
        <div className='flex flex-col'>
          <Link href={`/${collectionPath}/${resource.slug}`}>
            <div className='flex text-dial-sapphire bg-dial-solitude rounded-t-lg h-20'>
              <div className='px-4 text-sm text-center font-semibold m-auto'>
                {resource.name}
              </div>
            </div>
            <div className='my-8 mx-auto'>
              <div className='w-16 h-24 relative opacity-60 mx-auto'>
                <Image
                  fill
                  className='object-contain'
                  alt={format('image.alt.logoFor', { name: resource.name })}
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
                />
              </div>
            </div>
          </Link>
          <div className='bg-dial-solitude flex flex-col h-36 rounded-b-md'>
            <div className='px-3 py-3 text-sm line-clamp-4'>
              <div className='line-clamp-4'>
                {parse(resource.description)}
              </div>
            </div>
            {resource.link &&
              <div className='bg-dial-biscotti hover:bg-dial-sunshine text-white mt-auto text-sm rounded-b-md'>
                <a
                  href={prependUrlWithProtocol(resource.link)}
                  className='flex flex-row justify-center'
                  target='_blank' rel='noreferrer'
                >
                  <div className='py-3 flex gap-2'>
                    {format('resource.visitLink')}
                    <FaExternalLinkAlt className='my-auto' />
                  </div>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

  return (
    listType === 'list' ? listDisplayType() : cardDisplayType()
  )
}

export default ResourceCard
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import Image from 'next/image'
import Breadcrumb from '../../shared/breadcrumb'
import EditButton from '../../shared/EditButton'
import { ObjectType } from '../../../lib/constants'
import CommentsCount from '../../shared/CommentsCount'
import { useOrganizationOwnerUser, useUser } from '../../../lib/hooks'

const StorefrontDetailLeft = ({ organization, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const { user } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/${locale}/storefronts/${organization.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full inline-flex gap-3'>
          {(isOrganizationOwner || user) && <EditButton type='link' href={generateEditLink()}/>}
          <CommentsCount
            commentsSectionRef={commentsSectionRef}
            objectId={organization.id}
            objectType={ObjectType.ORGANIZATION}
          />
        </div>
        <div className='h4 font-bold py-4'>{format('ui.storefront.label')}</div>
      </div>
      <div className='bg-white border-t border-l border-r border-dial-gray lg:mr-6 shadow-lg'>
        {
          organization.whenEndorsed && (
            <div className='flex flex-row p-1.5 border-b border-dial-gray text-xs font-semibold text-dial-cyan'>
              <img
                alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                className='mr-2 h-6' src='/icons/digiprins/digiprins.png'
              />
              <div className='my-auto'>
                {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
              </div>
            </div>
          )
        }
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold w-4/5 md:w-auto lg:w-64 2xl:w-80 text-dial-purple overflow-hidden'>
            {organization.name}
          </div>
          <div className='mx-auto mt-4 w-3/5 h-3/5 relative'>
            <Image
              fill
              className='w-40 object-contain'
              alt={format('image.alt.logoFor', { name: organization.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
            />
          </div>
        </div>
      </div>
      <Link href={`/organizations/${organization.slug}`}>
        <div className='bg-dial-sapphire text-white shadow-md rounded lg:mr-6 mt-2'>
          <div className='py-3 px-4 text-center '>
            View Organization Record
          </div>
        </div>
      </Link>
    </>
  )
}

export default StorefrontDetailLeft

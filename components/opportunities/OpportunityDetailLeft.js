import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { ObjectType } from '../../lib/constants'
import CommentsCount from '../shared/CommentsCount'
import { useUser } from '../../lib/hooks'
import { getOpportunityStatusBgColor } from '../../lib/utilities'
import DeleteOpportunity from './DeleteOpportunity'

const OpportunityDetailLeft = ({ opportunity, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { user, isAdminUser } = useUser()

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/${locale}/opportunities/${opportunity.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[opportunity.slug] = opportunity.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full inline-flex gap-3'>
          {isAdminUser && <DeleteOpportunity opportunity={opportunity} />}
          {isAdminUser && <EditButton type='link' href={generateEditLink()}/>}
          <CommentsCount
            commentsSectionRef={commentsSectionRef}
            objectId={opportunity.id}
            objectType={ObjectType.OPPORTUNITY}
          />
        </div>
        <div className='h4 font-bold py-4'>{format('opportunity.label')}</div>
      </div>
      <div className='bg-white border border-dial-gray shadow-md'>
        <div className='flex flex-col p-4'>
          <div className='flex'>
            <div className='text-xl font-semibold text-building-block'>
              {opportunity.name}
            </div>
            {opportunity?.opportunityStatus &&
              <div className='ml-auto my-auto text-white'>
                <div className={`text-sm px-2 py-1 rounded ${getOpportunityStatusBgColor(opportunity)}`}>
                  {opportunity.opportunityStatus}
                </div>
              </div>
            }
          </div>
          <div className='my-8 mx-auto'>
            <div className='block w-40 h-40 relative'>
              <Image
                layout='fill'
                objectFit='scale-down'
                alt={format('image.alt.logoFor', { name: opportunity.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OpportunityDetailLeft

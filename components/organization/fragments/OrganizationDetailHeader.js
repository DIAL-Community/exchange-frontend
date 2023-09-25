import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { prependUrlWithProtocol } from '../../utils/utilities'
import OrganizationDetailSectors from './OrganizationDetailSectors'

const OrganizationDetailHeader = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {organization.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {organization.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className='object-contain w-20 h-20'
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className='object-contain dial-plum-filter'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('organization.website')}
          </div>
          <div className='flex text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(organization.website)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1'>
                {organization.website}
              </div>
            </a>
            &nbsp;⧉
          </div>
        </div>
        <OrganizationDetailSectors organization={organization} canEdit={canEdit} />
        {organization.whenEndorsed &&
          <>
            <hr className='border-b border-dial-slate-200'/>
            <div className='flex flex-col gap-y-2 text-xs grow shrink-0'>
              <div className='text-sm italic'>
                {format('organization.isEndorser')}
              </div>
              <div className='flex gap-x-1 italic text-dial-stratos'>
                <span>{format('ui.organization.endorsedIn')}:</span>
                <FormattedDate value={organization.whenEndorsed} />
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default OrganizationDetailHeader

import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../utils/utilities'

const OrganizationDetailHeader = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {organization.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        <div className='w-20 h-20'>
          <img
            src='/ui/v1/organization-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.candidateOrganization.label') })}
            className='object-contain dial-plum-filter w-20 h-20'
          />
        </div>
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
      </div>
    </div>
  )
}

export default OrganizationDetailHeader

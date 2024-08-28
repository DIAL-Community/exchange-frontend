import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../utils/utilities'

const ResourceDetailHeader = ({ candidateResource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {candidateResource.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        <img
          src='/ui/v1/resource-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.candidateResource.label') })}
          className='object-contain w-16 h-16'
        />
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-meadow'>
            {format('ui.candidateResource.resourceLink')}
          </div>
          <div className='flex text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(candidateResource.resourceLink)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1 break-all'>
                {candidateResource.linkDescription}
              </div>
            </a>
            &nbsp;⧉
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-meadow'>
            {format('ui.country.header')}
          </div>
          {candidateResource.countries.length
            ? <div className='text-dial-stratos'>
              {candidateResource.countries?.map(country => country.name).join(', ')}
            </div>
            : <div className='text-sm text-dial-stratos'>
              {format( 'ui.common.detail.noData', {
                entity: format('ui.country.label'),
                base: format('ui.resource.label')
              })}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailHeader

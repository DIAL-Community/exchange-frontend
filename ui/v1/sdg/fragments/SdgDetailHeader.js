import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'

const SdgDetailHeader = ({ sdg }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {sdg.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {sdg.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.sdg.label') })}
              className='object-contain w-20 h-20'
            />
          </div>
        }
        {sdg.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.sdg.label') })}
              className='object-contain dial-plum-filter'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('sdg.website')}
          </div>
          <div className='flex text-dial-stratos'>
            <a href={prependUrlWithProtocol(sdg.website)} target='_blank' rel='noreferrer'>
              <div className='border-b border-dial-iris-blue'>
                {sdg.website} ⧉
              </div>
            </a>
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.sector.header')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {sdg.sectors.length === 0 && format('general.na')}
            {sdg.sectors.map((sector, index) => {
              return <div key={index}>{sector.name}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SdgDetailHeader

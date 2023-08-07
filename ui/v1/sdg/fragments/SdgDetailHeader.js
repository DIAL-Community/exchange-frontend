import { useCallback } from 'react'
import { useIntl } from 'react-intl'

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
    </div>
  )
}

export default SdgDetailHeader

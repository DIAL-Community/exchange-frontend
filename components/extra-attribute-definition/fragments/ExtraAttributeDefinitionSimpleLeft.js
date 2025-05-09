import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const ExtraAttributeDefinitionSimpleLeft = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('ui.extraAttributeDefinition.label')}
        </div>
        <div className='flex justify-center items-center py-16 bg-white rounded'>
          <img
            src='/ui/v1/extra-attribute-definition-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.extraAttributeDefinition.label') })}
            width={100}
            height={100}
            className='object-contain object-center'
          />
        </div>
      </div>
    </div>
  )
}

export default ExtraAttributeDefinitionSimpleLeft

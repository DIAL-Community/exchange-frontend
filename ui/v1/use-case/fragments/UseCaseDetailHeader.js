import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const UseCaseDetailHeader = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-blueberry font-semibold'>
        {useCase.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {useCase.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 px-1 py-1 rounded-full bg-dial-blueberry'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain dial-blueberry-filter w-14 h-14 mx-auto my-2 white-filter'
            />
          </div>
        }
        {useCase.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain dial-blueberry-filter'
            />
          </div>
        }
      </div>
    </div>
  )
}

export default UseCaseDetailHeader

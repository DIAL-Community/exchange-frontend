import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const UseCaseDetailHeader = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-blueberry'>
        {useCase.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded'>
        <img
          // src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
          src='/ui/v1/use-case-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
          width={100}
          height={100}
          // className='object-contain dial-blueberry-filter'
          className='object-contain object-center'
        />
      </div>
    </div>
  )
}

export default UseCaseDetailHeader

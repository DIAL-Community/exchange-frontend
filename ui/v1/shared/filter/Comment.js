import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Comment = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.comment.title')}
      </div>
      <div className='text-sm text-dial-stratos'>
        {format('ui.comment.subTitle', { entity: format('useCase.label') })}
      </div>
      <div className='flex text-white'>
        <div className='bg-dial-iris-blue rounded-md text-sm'>
          <div className='px-5 py-3'>
            {format('ui.comment.title')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment

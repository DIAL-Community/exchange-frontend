import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Comment = ({ entityKey, scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const scrollToComment = () => {
    if (scrollRef && scrollRef.current) {
      const scrollTargetRef = scrollRef.current.find(ref => ref.value === 'ui.comment.label')
      scrollTargetRef?.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.comment.label')}
      </div>
      <div className='text-sm text-dial-stratos'>
        {format('ui.comment.description', { entity: format(entityKey) })}
      </div>
      <div className='flex text-white'>
        <div className='bg-dial-iris-blue rounded-md text-sm'>
          <button className='px-5 py-3' onClick={scrollToComment}>
            {format('ui.comment.buttonTitle')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comment

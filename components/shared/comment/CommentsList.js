import { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Loading } from '../FetchStatus'
import CommentCard from './CommentCard'

const CommentsList = ({ comments, refetch, loading, onClose }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  useEffect(
    () => {
      refetch
    },
    [refetch]
  )

  return (
    <div className='mt-28'>
      <div className='card-title text-dial-gray-dark mb-3'>
        {format('app.comment')}
      </div>
      <div className='bg-edit p-6'>
        {loading ? <Loading /> : (
          comments?.length ? (
            <div className='flex flex-col gap-3'>
              {comments?.map(({ comId, fullName, avatarUrl, text, replies }, commentIdx) => (
                <CommentCard
                  key={commentIdx}
                  commentId={comId}
                  authorFullName={fullName}
                  authorAvatarUrl={avatarUrl}
                  text={text}
                  replies={replies}
                />
              ))}
            </div>
          ) : format('shared.comment.no-comments')
        )}
        <div className='flex justify-end mt-8 gap-3 text-xl'>
          <button
            type='button'
            onClick={onClose}
            className='cancel-button'
            data-testid='close-button'
          >
            {format('app.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentsList

import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import parse from 'html-react-parser'
import DeleteComment from './DeleteComment'

const CommentCard = ({ commentId, authorFullName, authorAvatarUrl, text, replies, className }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className={classNames('bg-white border border-dial-gray shadow-md', className)}>
      <div className='flex flex-row flex-wrap gap-x-8 p-4 items-center'>
        <div className='inline-flex gap-x-2 items-center text-dial-gray-dark font-bold self-start'>
          <img
            className='rounded-full w-8'
            alt={format('image.alt.logoFor', { name: authorFullName })}
            src={authorAvatarUrl}
          />
          {authorFullName}
        </div>
        <div className='flex-1 text-justify'>
          {parse(text)}
        </div>
        <DeleteComment commentId={commentId} />
      </div>
      {!!replies?.length && (
        <div className='pl-10 p-3 flex flex-col gap-3'>
          {replies?.map(({ comId, fullName, avatarUrl, text, replies }, commentIdx) => (
            <CommentCard
              key={commentIdx}
              commentId={comId}
              authorFullName={fullName}
              authorAvatarUrl={avatarUrl}
              text={text}
              replies={replies}
              className='border-l-4'
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentCard

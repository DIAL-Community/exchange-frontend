import { useQuery } from '@apollo/client'
import { FaRegCommentDots } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { COMMENTS_COUNT_QUERY } from '../../queries/comment'

const CommentCount = ({ objectId, objectType, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { data } = useQuery(COMMENTS_COUNT_QUERY, {
    variables: {
      commentObjectId: parseInt(objectId),
      commentObjectType: objectType
    }
  })

  const scrollToCommentsSection = () => commentsSectionRef.current.scrollIntoView()

  return (
    <div className='inline-flex items-center text-dial-sapphire text-sm cursor-pointer' onClick={scrollToCommentsSection}>
      <FaRegCommentDots className='mr-1'/>
      <span>{data?.countComments > 0 ? `${data.countComments} - ${format('app.comment')}` : format('app.nocomment')}</span>
    </div>
  )
}

export default CommentCount

import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import 'react-comments-section/dist/index.css'
const CommentSection = dynamic(() => import('react-comments-section').then((module) => module.CommentSection), { ssr: false })
import { useMutation, useQuery } from '@apollo/client'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { CREATE_COMMENT, DELETE_COMMENT } from '../../mutations/comment'
import { COMMENTS_QUERY } from '../../queries/comment'

const INPUT_CLASSNAME = 'public-DraftStyleDefault-block'
const INPUT_BORDERED_WRAPPER_CLASSNAME = 'advanced-border'
const FOCUSED_CLASSNAME = 'focused'
const FIRST_ELEMENT_INDEX = 0

const CommentsSection = ({ objectId, objectType, commentsSectionRef, className }) => {
  const { locale } = useRouter()
  const innerRef = useRef(null)
  const [session] = useSession()
  const user = session?.user

  const { data } = useQuery(COMMENTS_QUERY, {
    variables: {
      commentObjectId: parseInt(objectId),
      commentObjectType: objectType
    }
  })

  const [createComment] = useMutation(CREATE_COMMENT, { refetchQueries: ['CountComments'] })
  const [deleteComment] = useMutation(DELETE_COMMENT, { refetchQueries: ['CountComments'] })

  const onCommentUpsertAction = (text, commentId, parentCommentId = null, parentOfRepliedCommentId = null) => {
    if (session) {
      const { userEmail, userToken } = session.user

      createComment({
        variables: {
          commentId,
          commentObjectType: objectType,
          commentObjectId: parseInt(objectId),
          userId: user.id,
          parentCommentId: parentOfRepliedCommentId ?? parentCommentId,
          text
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCommentDeleteAction = (commentId) => {
    if (session) {
      const { userEmail, userToken } = session.user

      deleteComment({
        variables: { commentId },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  useEffect(() => document.addEventListener('click', handleClickOutside))

  const getElementsByClassName = useCallback((className) => Array.from(innerRef?.current?.getElementsByClassName(className) ?? []), [])

  const focusActiveElement = () => {
    const activeInput = document.activeElement.getElementsByClassName(INPUT_CLASSNAME)[FIRST_ELEMENT_INDEX]
    const focusedInputIndex = getElementsByClassName(INPUT_CLASSNAME).findIndex(input => input === activeInput)
    getElementsByClassName(INPUT_BORDERED_WRAPPER_CLASSNAME).forEach((input, inputIdx) => {
      if (inputIdx === focusedInputIndex) {
        input.classList.add(FOCUSED_CLASSNAME)
      } else {
        input.classList.remove(FOCUSED_CLASSNAME)
      }
    })
  }

  const handleClickOutside = ({ target }) => {
    if (!getElementsByClassName(INPUT_CLASSNAME).some(element => element.contains(target))) {
      getElementsByClassName(INPUT_BORDERED_WRAPPER_CLASSNAME).forEach(input => input.classList.remove(FOCUSED_CLASSNAME))
    }
  }

  const [commentData, setCommentData] = useState([])

  useEffect(() => {
    if (data?.comments) {
      const commentData = []
      // eslint-disable-next-line no-unused-vars
      data.comments.forEach(({ replies, __typename, ...otherCommentProps }) => {
        commentData.push({
          // eslint-disable-next-line no-unused-vars
          replies: replies.map(({ __typename, ...otherReplyProps }) => otherReplyProps),
          ...otherCommentProps
        })
      })
      setCommentData(commentData)
    }
  }, [data?.comments])

  return (
    <div ref={commentsSectionRef} className={classNames(className)}>
      <div id='comments-section' ref={innerRef} onClick={focusActiveElement}>
        <CommentSection
          commentData={commentData}
          currentUser={user ? {
            currentUserId: String(user.id),
            currentUserImg: `https://ui-avatars.com/api/name=${user.name}&background=random`,
            currentUserFullName: user.name
          } : null}
          logIn={{
            loginLink: '/auth/signin',
            signupLink: '/auth/signup'
          }}
          onSubmitAction={({ text, comId }) => onCommentUpsertAction(text, comId)}
          onReplyAction={({ text, comId, repliedToCommentId, parentOfRepliedCommentId }) => onCommentUpsertAction(text, comId, repliedToCommentId, parentOfRepliedCommentId)}
          onEditAction={({ text, comId }) => onCommentUpsertAction(text, comId)}
          onDeleteAction={({ comIdToDelete }) => onCommentDeleteAction(comIdToDelete)}
          advancedInput
          hrStyle={{ borderColor: '#dfdfea' }}
          formStyle={{ backgroundColor: 'white' }}
        />
      </div>
    </div>
  )
}

export default CommentsSection

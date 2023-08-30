import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { CREATE_COMMENT, DELETE_COMMENT } from '../../../mutations/comment'
import { COMMENTS_QUERY } from '../../../queries/comment'
import { useUser } from '../../../lib/hooks'
import { Loading } from '../FetchStatus'
import EditButton from '../EditButton'
import CommentsList from './CommentsList'
const CommentSection = dynamic(
  () => import('react-comments-section').then((module) => module.CommentSection),
  { ssr: false }
)

const INPUT_CLASSNAME = 'public-DraftStyleDefault-block'
const INPUT_BORDERED_WRAPPER_CLASSNAME = 'advanced-border'
const FOCUSED_CLASSNAME = 'focused'
const FIRST_ELEMENT_INDEX = 0

const UI_AVATAR_PARAMS = 'background=2e3192&color=fff&format=svg'

const CommentsSection = ({ objectId, objectType, commentsSectionRef, className }) => {
  const { locale } = useRouter()
  const innerRef = useRef(null)
  const { loadingUserSession, user, isAdminUser } = useUser()

  const { data, refetch, loading } = useQuery(COMMENTS_QUERY, {
    variables: {
      commentObjectId: parseInt(objectId),
      commentObjectType: objectType
    },
    notifyOnNetworkStatusChange: true
  })

  const [createComment] = useMutation(CREATE_COMMENT, { refetchQueries: ['CountComments'] })
  const [deleteComment] = useMutation(DELETE_COMMENT, { refetchQueries: ['CountComments'] })

  const onCommentUpsertAction = (text, commentId, parentCommentId = null, parentOfRepliedCommentId = null) => {
    if (user) {
      const { userEmail, userToken } = user

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
    if (user) {
      const { userEmail, userToken } = user

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

  const getElementsByClassName = useCallback(
    (className) => Array.from(innerRef?.current?.getElementsByClassName(className) ?? []),
    []
  )

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
    const inputs = getElementsByClassName(INPUT_BORDERED_WRAPPER_CLASSNAME)
    if (!inputs.some(element => element.contains(target))) {
      inputs.forEach(input => input.classList.remove(FOCUSED_CLASSNAME))
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

  const [isInEditMode, setIsInEditMode] = useState(false)

  const toggleIsInEditMode = () => setIsInEditMode(!isInEditMode)

  return (
    <div ref={commentsSectionRef} className={classNames(className)}>
      {loadingUserSession && <Loading />}
      {isInEditMode ? (
        <CommentsList
          comments={data?.comments}
          refetch={refetch}
          loading={loading}
          onClose={toggleIsInEditMode}
        />
      ) : (
        <div id='comments-section' ref={innerRef} onClick={focusActiveElement}>
          {isAdminUser && (
            <div className='flex justify-end'>
              <EditButton onClick={toggleIsInEditMode} />
            </div>
          )}
          <CommentSection
            commentData={commentData}
            currentUser={user ? {
              currentUserId: String(user.id),
              currentUserImg: `https://ui-avatars.com/api/name=${user.userName}&${UI_AVATAR_PARAMS}`,
              currentUserFullName: user.userName
            } : null}
            logIn={{
              loginLink: '/auth/signin',
              signupLink: '/auth/signup'
            }}
            onSubmitAction={({ text, comId }) => onCommentUpsertAction(text, comId)}
            onReplyAction={
              ({ text, comId, repliedToCommentId, parentOfRepliedCommentId }) =>
                onCommentUpsertAction(text, comId, repliedToCommentId, parentOfRepliedCommentId)
            }
            onEditAction={({ text, comId }) => onCommentUpsertAction(text, comId)}
            onDeleteAction={({ comIdToDelete }) => onCommentDeleteAction(comIdToDelete)}
            advancedInput
            hrStyle={{ borderColor: '#dfdfea' }}
            formStyle={{ backgroundColor: 'white' }}
          />
        </div>
      )}
    </div>
  )
}

export default CommentsSection

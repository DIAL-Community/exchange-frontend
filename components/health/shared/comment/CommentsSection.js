import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { useUser } from '../../../../lib/hooks'
import CommentsList from '../../../shared/comment/CommentsList'
import { Loading } from '../../../shared/FetchStatus'
import EditButton from '../../../shared/form/EditButton'
import { CREATE_COMMENT, DELETE_COMMENT } from '../../../shared/mutation/comment'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../../../shared/query/comment'

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

  const { data, loading } = useQuery(COMMENTS_QUERY, {
    variables: {
      commentObjectId: parseInt(objectId),
      commentObjectType: objectType
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{
      query: COMMENTS_COUNT_QUERY,
      variables: {
        commentObjectId: parseInt(objectId),
        commentObjectType: objectType
      },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: COMMENTS_QUERY,
      variables: {
        commentObjectId: parseInt(objectId),
        commentObjectType: objectType
      },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }]
  })
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{
      query: COMMENTS_COUNT_QUERY,
      variables: {
        commentObjectId: parseInt(objectId),
        commentObjectType: objectType
      },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: COMMENTS_QUERY,
      variables: {
        commentObjectId: parseInt(objectId),
        commentObjectType: objectType
      },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }]
  })

  const onCommentUpsertAction = (text, commentId, parentCommentId = null, parentOfRepliedCommentId = null) => {
    if (user) {
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
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const onCommentDeleteAction = (commentId) => {
    if (user) {
      deleteComment({
        variables: { commentId },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const getElementsByClassName = useCallback((className) => {
    return Array.from(innerRef?.current?.getElementsByClassName(className) ?? [])
  },[])

  const handleClickOutside = useCallback(({ target }) => {
    const inputs = getElementsByClassName(INPUT_BORDERED_WRAPPER_CLASSNAME)
    if (!inputs.some(element => element.contains(target))) {
      inputs.forEach(input => input.classList.remove(FOCUSED_CLASSNAME))
    }
  }, [getElementsByClassName])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [handleClickOutside])

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

  const [commentData, setCommentData] = useState([])

  useEffect(() => {
    if (data?.comments) {
      const commentData = []
      data.comments.forEach(({ replies, ...otherCommentProps }) => {
        commentData.push({
          replies: replies.map(({ ...otherReplyProps }) => otherReplyProps),
          ...otherCommentProps
        })
      })
      setCommentData(commentData)
    }
  }, [data?.comments])

  const [isInEditMode, setIsInEditMode] = useState(false)

  const toggleIsInEditMode = () => setIsInEditMode(!isInEditMode)

  return (
    <div ref={commentsSectionRef} className={classNames(className, 'text-dial-sapphire max-w-[50vw]')}>
      {loadingUserSession && <Loading />}
      {isInEditMode
        ? <CommentsList
          comments={data?.comments}
          loading={loading}
          onClose={toggleIsInEditMode}
          objectId={objectId}
          objectType={objectType}
        />
        : (
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
              removeEmoji
              hrStyle={{ borderColor: '#dfdfea' }}
              formStyle={{ backgroundColor: 'white', fontFamily: 'Poppins, sans-serif' }}
              imgStyle={{ margin: 'auto' }}
            />
          </div>
        )
      }
    </div>
  )
}

export default CommentsSection

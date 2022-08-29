import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/client'
import { useCallback, useEffect, useRef } from 'react'
import 'react-comments-section/dist/index.css'
const CommentSection = dynamic(() => import('react-comments-section').then((module) => module.CommentSection), { ssr: false })
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { CREATE_COMMENT } from '../../mutations/comment'
import { COMMENTS_QUERY } from '../../queries/comment'

const INPUT_CLASSNAME = 'public-DraftStyleDefault-block'
const INPUT_BORDERED_WRAPPER_CLASSNAME = 'advanced-border'
const FOCUSED_CLASSNAME = 'focused'
const FIRST_ELEMENT_INDEX = 0

const CommentsSection = ({ objectId, objectType }) => {
  const { locale } = useRouter()
  const ref = useRef(null)
  const [session] = useSession()
  const user = session?.user

  const { data } = useQuery(COMMENTS_QUERY, {
    variables: {
      commentObjectId: parseInt(objectId),
      commentObjectType: objectType
    }
  })

  const [createComment] = useMutation(CREATE_COMMENT)

  const onCommentUpsertAction = (text, commentId, parentCommentId = null) => {
    if (session) {
      const { userEmail, userToken } = session.user

      createComment({
        variables: {
          commentId,
          commentObjectType: objectType,
          commentObjectId: parseInt(objectId),
          userId: user.id,
          parentCommentId,
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

  useEffect(() => document.addEventListener('click', handleClickOutside))

  const getElementsByClassName = useCallback((className) => Array.from(ref?.current?.getElementsByClassName(className) ?? []), [])

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

  return (
    <div id='comments-section' ref={ref} onClick={focusActiveElement}>
      <CommentSection
        commentData={data?.comments}
        currentUser={user ? {
          currentUserId: user.id,
          currentUserImg: `https://ui-avatars.com/api/name=${user.name}&background=random`,
          currentUserFullName: user.name
        } : null}
        logIn={{
          loginLink: '/auth/signin',
          signupLink: '/auth/signup'
        }}
        onSubmitAction={({ text, comId }) => {onCommentUpsertAction(text, comId)}}
        onReplyAction={({ text, comId, repliedToCommentId }) => {onCommentUpsertAction(text, comId, repliedToCommentId)}}
        onEditAction={({ text, comId }) => {onCommentUpsertAction(text, comId)}}
        advancedInput
        hrStyle={{ borderColor: '#dfdfea' }}
        formStyle={{ backgroundColor: 'white' }}
      />
    </div>
  )
}

export default CommentsSection

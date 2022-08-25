import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/client'
import { useCallback, useEffect, useRef } from 'react'
import 'react-comments-section/dist/index.css'
const CommentSection = dynamic(() => import('react-comments-section').then((module) => module.CommentSection), { ssr: false })

const INPUT_CLASSNAME = 'public-DraftStyleDefault-block'
const INPUT_BORDERED_WRAPPER_CLASSNAME = 'advanced-border'
const FOCUSED_CLASSNAME = 'focused'
const FIRST_ELEMENT_INDEX = 0

const CommentsSection = () => {
  const [session] = useSession()
  const user = session?.user

  const ref = useRef(null)

  useEffect(() => document.addEventListener('click', handleClickOutside))

  const getElementsByClassName = useCallback((className) => Array.from(ref.current.getElementsByClassName(className)), [])

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
        currentUser={user ? {
          currentUserId: user.id,
          currentUserImg: `https://ui-avatars.com/api/name=${user.name}&background=random`,
          currentUserFullName: user.name
        } : null}
        logIn={{
          loginLink: '/auth/signin',
          signupLink: '/auth/signup'
        }}
        advancedInput
        hrStyle={{ borderColor: '#dfdfea' }}
        formStyle={{ backgroundColor: 'white' }}
      />
    </div>
  )
}

export default CommentsSection

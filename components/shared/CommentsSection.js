import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/client'
const CommentSection = dynamic(() => import('react-comments-section').then((module) => module.CommentSection), { ssr: false })
import 'react-comments-section/dist/index.css'

const CommentsSection = () => {
  const [session] = useSession()
  const user = session?.user

  return (
    <CommentSection
      currentUser={user ? {
        currentUserId: user.id,
        currentUserImg: `https://ui-avatars.com/api/name=${user.name}&background=random`,
        currentUserFullName: user.name,
      } : null }
      logIn={{
        loginLink: '/auth/signin',
        signupLink: '/auth/signup'
      }}
      advancedInput
    />
  )
}

export default CommentsSection

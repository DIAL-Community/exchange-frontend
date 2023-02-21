import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ApiEditor from '../../../../components/govstack/ApiEditor'
import { DEFAULT_COMMITTER_EMAIL, DEFAULT_COMMITTER_NAME, DEFAULT_REPO_OWNER } from '../../../../components/govstack/common'
import Header from '../../../../components/govstack/Header'
import { MetadataContextProvider } from '../../../../components/govstack/MetadataContext'
import { EditorContextProvider } from '../../../../components/shared/github/EditorContext'
import { useUser } from '../../../../lib/hooks'

const GovStackApiEdit = () => {
  const router = useRouter()
  const { query: { name } } = router

  const [userName, setUserName] = useState(DEFAULT_COMMITTER_NAME)
  const [userEmail, setUserEmail] = useState(DEFAULT_COMMITTER_EMAIL)

  const { user } = useUser()

  useEffect(() => {
    if (user) {
      setUserName(user.name)
      setUserEmail(user.userEmail)
    }
  }, [user])

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <MetadataContextProvider>
          <EditorContextProvider
            owner={DEFAULT_REPO_OWNER}
            userEmail={userEmail}
            userName={userName}
          >
            <ApiEditor repositoryName={name} />
          </EditorContextProvider>
        </MetadataContextProvider>
      </div>
    </>
  )
}

export default GovStackApiEdit

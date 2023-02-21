import { useEffect, useState } from 'react'
import {
  DEFAULT_COMMITTER_EMAIL,
  DEFAULT_COMMITTER_NAME,
  DEFAULT_METADATA_REPOSITORY,
  DEFAULT_REPO_OWNER
} from '../../../components/govstack/common'
import Header from '../../../components/govstack/Header'
import MetadataEditor from '../../../components/govstack/MetadataEditor'
import { EditorContextProvider } from '../../../components/shared/github/EditorContext'
import { useUser } from '../../../lib/hooks'

const GovStackApiEditor = () => {
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
        <EditorContextProvider
          path='api-metadata.yml'
          repository={DEFAULT_METADATA_REPOSITORY}
          owner={DEFAULT_REPO_OWNER}
          userEmail={userEmail}
          userName={userName}
        >
          <MetadataEditor/>
        </EditorContextProvider>
      </div>
    </>
  )
}

export default GovStackApiEditor

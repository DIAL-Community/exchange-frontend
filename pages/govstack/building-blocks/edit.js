import {
  DEFAULT_COMMITTER_EMAIL, DEFAULT_COMMITTER_NAME, DEFAULT_METADATA_REPOSITORY, DEFAULT_REPO_OWNER
} from '../../../components/govstack/common'
import Header from '../../../components/govstack/Header'
import MetadataEditor from '../../../components/govstack/MetadataEditor'
import { EditorContextProvider } from '../../../components/shared/github/EditorContext'
import { useUser } from '../../../lib/hooks'

const GovStackApiEditor = () => {
  const { user } = useUser()

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <EditorContextProvider
          path='api-metadata.yml'
          owner={DEFAULT_REPO_OWNER}
          repository={DEFAULT_METADATA_REPOSITORY}
          userName={user ? user?.userName : DEFAULT_COMMITTER_NAME}
          userEmail={user ? user?.userEmail : DEFAULT_COMMITTER_EMAIL}
        >
          <MetadataEditor/>
        </EditorContextProvider>
      </div>
    </>
  )
}

export default GovStackApiEditor

import { useRouter } from 'next/router'
import ApiEditor from '../../../../components/govstack/ApiEditor'
import { DEFAULT_COMMITTER_EMAIL, DEFAULT_COMMITTER_NAME, DEFAULT_REPO_OWNER } from '../../../../components/govstack/common'
import Header from '../../../../components/govstack/Header'
import { MetadataContextProvider } from '../../../../components/govstack/MetadataContext'
import { EditorContextProvider } from '../../../../components/shared/github/EditorContext'
import { useUser } from '../../../../lib/hooks'

const GovStackApiEdit = () => {
  const router = useRouter()
  const { query: { name } } = router

  const { user } = useUser()

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <MetadataContextProvider>
          <EditorContextProvider
            owner={DEFAULT_REPO_OWNER}
            userName={user ? user?.userName : DEFAULT_COMMITTER_NAME}
            userEmail={user ? user?.userEmail : DEFAULT_COMMITTER_EMAIL}
          >
            <ApiEditor repositoryName={name} />
          </EditorContextProvider>
        </MetadataContextProvider>
      </div>
    </>
  )
}

export default GovStackApiEdit

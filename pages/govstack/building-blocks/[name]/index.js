import { useRouter } from 'next/router'
import ApiViewer from '../../../../components/govstack/ApiViewer'
import { DEFAULT_REPO_OWNER } from '../../../../components/govstack/common'
import Header from '../../../../components/govstack/Header'
import { MetadataContextProvider } from '../../../../components/govstack/MetadataContext'
import { EditorContextProvider } from '../../../../components/shared/github/EditorContext'

const BuildingBlockApi = () => {
  const router = useRouter()
  const { query: { name } } = router

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <MetadataContextProvider>
          <EditorContextProvider owner={DEFAULT_REPO_OWNER}>
            <ApiViewer repositoryName={name} />
          </EditorContextProvider>
        </MetadataContextProvider>
      </div>
    </>
  )
}

export default BuildingBlockApi

import { useRouter } from 'next/router'
import ApiViewer from '../../../../components/govstack/ApiViewer'
import Header from '../../../../components/govstack/Header'

const BuildingBlockApi = () => {
  const router = useRouter()
  const { query: { name } } = router

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <ApiViewer repoName={name} />
      </div>
    </>
  )
}

export default BuildingBlockApi

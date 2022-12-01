import { useRouter } from 'next/router'
import ApiEditor from '../../../../components/govstack/ApiEditor'
import Header from '../../../../components/govstack/Header'

const GovStackApiEdit = () => {
  const router = useRouter()
  const { query: { name } } = router

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <ApiEditor repoName={name} />
      </div>
    </>
  )
}

export default GovStackApiEdit

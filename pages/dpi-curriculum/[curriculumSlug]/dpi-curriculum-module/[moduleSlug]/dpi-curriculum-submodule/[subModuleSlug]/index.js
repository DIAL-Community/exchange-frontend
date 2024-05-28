import { useEffect } from 'react'
import { useRouter } from 'next/router'
import DpiFooter from '../../../../../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../../../../../components/dpi/sections/DpiHeader'
import { Loading } from '../../../../../../../components/shared/FetchStatus'

const DpiCurriculumSubModulePage = () => {
  const router = useRouter()
  const { curriculumSlug } = router.query

  useEffect(() => {
    router.push(`/dpi-curriculum/${curriculumSlug}/`)
  }, [router, curriculumSlug])

  return (
    <>
      <DpiHeader />
      <Loading />
      <DpiFooter />
    </>
  )
}

export default DpiCurriculumSubModulePage

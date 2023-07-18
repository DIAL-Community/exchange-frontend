import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GradientBackground from '../../../../components/shared/GradientBackground'
import SearchFilter from '../../../../components/shared/SearchFilter'
import { UserFilterContext, UserFilterDispatchContext } from '../../../../components/context/UserFilterContext'
import ClientOnly from '../../../../lib/ClientOnly'
import PageContent from '../../../../components/main/PageContent'
import { useUser } from '../../../../lib/hooks'
const ResourcesListQuery = dynamic(() => import('../../../../components/resources/ResourceList'), { ssr: false })

const Resources = () => {
  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  const { isAdminUser } = useUser()

  return (
    <>
      <GradientBackground />
      <Header />
      <ClientOnly>
        <PageContent
          content={<ResourcesListQuery />}
          searchFilter={
            <SearchFilter
              search={search}
              setSearch={setSearch}
              hint='filter.entity.resources'
              exportJson={false}
              exportCsv={false}
              createNew={isAdminUser}
            />
          }
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Resources

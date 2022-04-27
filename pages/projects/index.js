import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import TabNav from '../../components/main/TabNav'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import ProjectHint from '../../components/filter/hint/ProjectHint'
import ProjectFilter from '../../components/projects/ProjectFilter'
import ProjectActiveFilter from '../../components/projects/ProjectActiveFilter'
import ProjectListQuery from '../../components/projects/ProjectList'
import SearchFilter from '../../components/shared/SearchFilter'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../../components/context/ProjectFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Projects = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(ProjectFilterContext)
  const { setSearch } = useContext(ProjectFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.projects' />
      <MobileNav activeTab='filter.entity.projects' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
          filter={<ProjectFilter />}
          content={<ProjectListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.projects' />}
          activeFilter={<ProjectActiveFilter />}
          hint={<ProjectHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Projects

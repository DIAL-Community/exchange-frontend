import { useCallback, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import TabNav from '../../components/main/TabNav'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import ProjectFilter from '../../components/projects/ProjectFilter'
import ProjectActiveFilter from '../../components/projects/ProjectActiveFilter'
import ProjectListQuery from '../../components/projects/ProjectList'
import SearchFilter from '../../components/shared/SearchFilter'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../../components/context/ProjectFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Projects = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { search } = useContext(ProjectFilterContext)
  const { setSearch } = useContext(ProjectFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('ui.project.header')}
        description={
          format(
            'shared.metadata.description.comprehensiveListOf',
            { entities: format('ui.project.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <TabNav activeTab='filter.entity.projects' />
        <MobileNav activeTab='filter.entity.projects' />
        <PageContent
          activeTab='filter.entity.projects'
          filter={<ProjectFilter />}
          content={<ProjectListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.projects'
            />
          }
          activeFilter={<ProjectActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Projects

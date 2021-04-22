import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../../components/context/ProjectFilterContext'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'
import ProjectListQuery from '../../components/projects/ProjectList'

const Projects = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search, displayType } = useContext(ProjectFilterContext)
  const { setSearch, setDisplayType } = useContext(ProjectFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <Filter activeTab='projects' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} placeholder='Search for a Project' />
      <ProjectListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Projects)

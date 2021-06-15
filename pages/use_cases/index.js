import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import UseCaseListQuery from '../../components/use-cases/UseCaseList'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../components/context/UseCaseFilterContext'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'

import dynamic from 'next/dynamic'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const UseCases = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search, displayType } = useContext(UseCaseFilterContext)
  const { setSearch, setDisplayType } = useContext(UseCaseFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Filter activeTab='filter.entity.useCases' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} placeholder={format('app.search') + format('use-case.label')} />
      <UseCaseListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(UseCases)

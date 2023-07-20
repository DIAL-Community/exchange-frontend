import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GradientBackground from '../../../../components/shared/GradientBackground'
import QueryNotification from '../../../../components/shared/QueryNotification'
import PageContent from '../../../../components/main/PageContent'
import UseCaseHint from '../../../../components/filter/hint/UseCaseHint'
import UseCaseFilter from '../../../../components/use-cases/UseCaseFilter'
import UseCaseActiveFilter from '../../../../components/use-cases/UseCaseActiveFilter'
import SearchFilter from '../../../../components/shared/SearchFilter'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../../../components/context/UseCaseFilterContext'
import ClientOnly from '../../../../lib/ClientOnly'
const UseCaseListQuery = dynamic(() => import('../../../../components/use-cases/UseCaseList'), { ssr: false })

const UseCases = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { search } = useContext(UseCaseFilterContext)
  const { setSearch } = useContext(UseCaseFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.useCases'
          filter={<UseCaseFilter />}
          content={<UseCaseListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.useCases' />}
          activeFilter={<UseCaseActiveFilter />}
          hint={<UseCaseHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default UseCases

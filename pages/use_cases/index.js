import { useCallback, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import MobileNav from '../../components/main/MobileNav'
import TabNav from '../../components/main/TabNav'
import PageContent from '../../components/main/PageContent'
import UseCaseHint from '../../components/filter/hint/UseCaseHint'
import UseCaseFilter from '../../components/use-cases/UseCaseFilter'
import UseCaseActiveFilter from '../../components/use-cases/UseCaseActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../components/context/UseCaseFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const UseCaseListQuery = dynamic(() => import('../../components/use-cases/UseCaseList'), { ssr: false })

const UseCases = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { search } = useContext(UseCaseFilterContext)
  const { setSearch } = useContext(UseCaseFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('use-case.header')}
        description={format('shared.metadata.description.listOfKey', { entities: format('use-case.header')?.toLocaleLowerCase() })}
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.useCases' />
      <MobileNav activeTab='filter.entity.useCases' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
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

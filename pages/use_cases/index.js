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
import UseCaseFilter from '../../components/use-cases/UseCaseFilter'
import UseCaseActiveFilter from '../../components/use-cases/UseCaseActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../components/context/UseCaseFilterContext'
import ClientOnly from '../../lib/ClientOnly'
import PageContent from '../../components/main/PageContent'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })
const UseCaseListQuery = dynamic(() => import('../../components/use-cases/UseCaseList'), { ssr: false })

const UseCases = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(UseCaseFilterContext)
  const { setSearch } = useContext(UseCaseFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('ui.useCase.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.useCase.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <TabNav activeTab='filter.entity.useCases' />
        <MobileNav activeTab='filter.entity.useCases' />
        <PageContent
          activeTab='filter.entity.useCases'
          filter={<UseCaseFilter />}
          content={<UseCaseListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.useCases'
            />
          }
          activeFilter={<UseCaseActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default UseCases

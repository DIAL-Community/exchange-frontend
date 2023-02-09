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
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('use-case.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <ClientOnly>
        <TabNav activeTab='filter.entity.useCases' />
        <MobileNav activeTab='filter.entity.useCases' />
        <div className='px-4 xl:px-16 py-4 xl:py-8 bg-dial-alice-blue'>
          <div className='grid grid-cols-1 xl:grid-cols-7 gap-3 xl:gap-x-24 xl:gap-y-8'>
            <div className='xl:col-span-2 row-span-2'>
              <UseCaseFilter />
            </div>
            <div className='xl:col-span-5 my-auto'>
              <SearchFilter {...{ search, setSearch }} hint='filter.entity.useCases' />
            </div>
            <div className='xl:col-span-5 flex flex-col gap-3'>
              <UseCaseActiveFilter />
              <UseCaseListQuery />
            </div>
          </div>
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default UseCases

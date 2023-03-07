import { useCallback, useContext } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SearchFilter from '../../components/shared/SearchFilter'
import { UserFilterContext, UserFilterDispatchContext } from '../../components/context/UserFilterContext'
import { Loading, Unauthorized } from '../../components/shared/FetchStatus'
import ClientOnly from '../../lib/ClientOnly'
import { useUser } from '../../lib/hooks'
import RubricCategoryListQuery from '../../components/rubric-categories/RubricCategoryList'

const RubricCategories = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, loadingUserSession } = useUser()

  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  return (
    <>
      <NextSeo title={format('rubric-categories.header')}/>
      <Header />
      <ClientOnly>
        {loadingUserSession ? <Loading /> : isAdminUser ? (
          <>
            <SearchFilter
              search={search}
              setSearch={setSearch}
              hint='filter.entity.rubric-categories'
              switchView={false}
              exportJson={false}
              exportCsv={false}
            />
            <RubricCategoryListQuery />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default RubricCategories

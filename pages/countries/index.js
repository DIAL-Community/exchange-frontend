import { useContext, useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'
import { UserFilterContext, UserFilterDispatchContext } from '../../components/context/UserFilterContext'
import { Loading, Unauthorized } from '../../components/shared/FetchStatus'
import ClientOnly from '../../lib/ClientOnly'
import { useUser } from '../../lib/hooks'
import CountryForm from '../../components/countries/CountryForm'
const CountriesListQuery = dynamic(() => import('../../components/countries/CountryList'), { ssr: false })

const Countries = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const toggleFormDialog = () => setIsFormDialogOpen(!isFormDialogOpen)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        {loadingUserSession ? <Loading /> : isAdminUser ? (
          <>
            <SearchFilter
              search={search}
              setSearch={setSearch}
              hint='filter.entity.countries'
              onCreateNewClick={toggleFormDialog}
              switchView={false}
              exportJson={false}
              exportCsv={false}
            />
            <CountriesListQuery />
            <CountryForm isOpen={isFormDialogOpen} onClose={toggleFormDialog} />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Countries

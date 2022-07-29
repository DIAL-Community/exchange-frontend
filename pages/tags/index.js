import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import { useSession } from 'next-auth/client'
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
const TagsListQuery = dynamic(() => import('../../components/tags/TagList'), { ssr: false })

const Tags = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [session] = useSession()
  const { isAdminUser, loadingUserSession } = useUser(session)

  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

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
        {loadingUserSession ? <Loading /> : isAdminUser ? (
          <>
            <SearchFilter {...{ search, setSearch }} hint='filter.entity.tags' />
            <TagsListQuery />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Tags

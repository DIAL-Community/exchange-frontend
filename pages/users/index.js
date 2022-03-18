import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import { useSession } from 'next-auth/client'

import apolloClient from '../../lib/apolloClient'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'

import SearchFilter from '../../components/shared/SearchFilter'
import { UserFilterContext, UserFilterDispatchContext } from '../../components/context/UserFilterContext'
import { Unauthorized } from '../../components/shared/FetchStatus'

import dynamic from 'next/dynamic'
const UserListQuery = dynamic(() => import('../../components/users/UserList'), { ssr: false })

const Users = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  const [session] = useSession()

  if (session && !session.roles.includes('admin')) {
    return (
      <Unauthorized />
    )
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <SearchFilter {...{ search, setSearch }} hint='filter.entity.users' />
      <UserListQuery displayType='list' />
      <Footer />
    </>
  )
}

export default apolloClient()(Users)

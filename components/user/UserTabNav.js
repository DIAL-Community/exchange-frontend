import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { USER_DETAIL_QUERY } from '../shared/query/user'
import TabNav from '../shared/TabNav'

const UserTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.user.header'
  ])

  useQuery(USER_DETAIL_QUERY, {
    variables: { userId: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.user.createNew'),
        'ui.user.createNew'
      ])
    }
  })

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.user.createNew'),
        'ui.user.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default UserTabNav

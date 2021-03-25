import { useState } from 'react'
import styles from '../styles/Home.module.css'

import Header from '../components/Header'
import WizardHeader from '../components/wizard/WizardHeader'
import WizardContent from '../components/wizard/WizardContent'
import withApollo from '../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const SECTOR_QUERY = gql`
query Sectors($first: Int, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      endCursor
      startCursor
      hasPreviousPage
      hasNextPage
    }
    nodes {
      id
      name
      slug
      imageFile
      productDescriptions {
        description
      }
    }
  }
}
`

const WizardPage = () => {
  const [stage, setStage] = useState(0)
  const { loading, error, data } = useQuery(SECTOR_QUERY)
  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }

  const { sectors } = data

  return (
    <div className={styles.container}>
      <Header />
      <WizardHeader stage={stage} />
      <WizardContent stage={stage} setStage={setStage} sectors={sectors} />
      <footer className={styles.footer} />
    </div>
  )
}

export default withApollo()(WizardPage)

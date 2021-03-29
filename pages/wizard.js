import { useState } from 'react'
import styles from '../styles/Home.module.css'

import Header from '../components/Header'
import WizardHeader from '../components/wizard/WizardHeader'
import WizardContent from '../components/wizard/WizardContent'
import withApollo from '../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const SECTOR_QUERY = gql`
query Sector {
  sectors {
    id
    name
    slug
  }
}
`
const USE_CASE_QUERY = gql`
query UseCases {
  useCases {
    id
    name
    slug
    useCaseDescriptions {
      description
    }
  }
}
`

const WizardPage = () => {
  const [stage, setStage] = useState(0)
  const { loading: sectorLoading, error: sectorError, data: sectorData } = useQuery(SECTOR_QUERY)
  const { loading: useCaseLoading, error: useCaseError, data: useCaseData } = useQuery(USE_CASE_QUERY)
  if (sectorLoading || useCaseLoading) {
    return <div>Fetching..</div>
  }
  if (sectorError || useCaseError) {
    return <div>Error!</div>
  }

  const sectors = sectorData.sectors.map((sector) => { return { label: sector.name, value: sector.name }})
  const useCases = useCaseData.useCases.map((useCase) => { return { label: useCase.name, value: useCase.name }})

  return (
    <div className={styles.container}>
      <Header />
      <WizardHeader stage={stage} />
      <WizardContent stage={stage} setStage={setStage} sectors={sectors} useCases={useCases} />
      <footer className={styles.footer} />
    </div>
  )
}

export default withApollo()(WizardPage)

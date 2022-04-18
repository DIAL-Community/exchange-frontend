import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WizardHeader from '../components/wizard/WizardHeader'
import WizardContent from '../components/wizard/WizardContent'
import WizardResults from '../components/wizard/WizardResults'
import ClientOnly from '../lib/ClientOnly'
import { Loading, Error } from '../components/shared/FetchStatus'

const SECTOR_QUERY = gql`
query SectorsWithSubs($locale: String) {
  sectorsWithSubs(locale: $locale) {
    id
    name
    slug
    subSectors {
      id
      name
      slug
    }
  }
}
`
const SDG_QUERY = gql`
query SDGs {
  sdgs {
    id
    name
    slug
  }
}
`

const COUNTRY_QUERY = gql`
query Countries {
  countries {
    id
    name
    slug
  }
}
`

const TAG_QUERY = gql`
query Tags {
  tags {
    id
    name
    slug
  }
}
`

const WizardPageDefinition = () => {
  const [stage, setStage] = useState(0)
  const [allValues, setAllValues] = useState({
    projectPhase: '',
    sector: '',
    subsector: '',
    sdg: '',
    useCase: '',
    countries: [],
    tags: [],
    mobileServices: [],
    buildingBlocks: [],
    productSortHint: '',
    projectSortHint: ''
  })
  const router = useRouter()
  const { locale } = router

  const { loading: sectorLoading, error: sectorError, data: sectorData } = useQuery(SECTOR_QUERY, { variables: { locale } })
  const { loading: sdgLoading, error: sdgError, data: sdgData } = useQuery(SDG_QUERY)
  const { loading: countryLoading, error: countryError, data: countryData } = useQuery(COUNTRY_QUERY)
  const { loading: tagLoading, error: tagError, data: tagData } = useQuery(TAG_QUERY)
  if (sectorLoading || sdgLoading || countryLoading || tagLoading) {
    return <><Header /><div><Loading /></div><Footer /></>
  }

  if (sectorError || sdgError || countryError || tagError) {
    return <div><Error /></div>
  }

  const mobileServices = ['Airtime', 'API', 'HS', 'Mobile-Internet', 'Mobile-Money', 'Ops-Maintenance', 'OTT', 'SLA', 'SMS', 'User-Interface', 'USSD', 'Voice']
  const projData = { sectors: [], useCases: [], countries: [], mobileServices: [], tags: [], buildingBlocks: [] }
  projData.sectors = sectorData.sectorsWithSubs.map((sector) => { return { label: sector.name, value: sector.name, subSectors: sector.subSectors } })
  projData.sdgs = sdgData.sdgs.map((sdg) => { return { label: sdg.name, value: sdg.name } })
  projData.countries = countryData.countries.map((country) => { return { label: country.name, value: country.name } })
  projData.tags = tagData.tags.map((tag) => { return { label: tag.name, value: tag.name } })
  projData.mobileServices = mobileServices.map((service) => { return { label: service, value: service } })
  projData.buildingBlocks = ['Data collection', 'Registration', 'Payments', 'Identification and authentication', 'Information mediator', 'Messaging', 'Scheduling', 'Content Management', 'eMarketplace']

  return (
    <>
      <WizardHeader stage={stage} setStage={setStage} />
      {stage < 4
        ? <WizardContent stage={stage} setStage={setStage} projData={projData} allValues={allValues} setAllValues={setAllValues} />
        : <WizardResults stage={stage} setStage={setStage} allValues={allValues} setAllValues={setAllValues} />}
    </>
  )
}

const WizardPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <WizardPageDefinition />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default WizardPage

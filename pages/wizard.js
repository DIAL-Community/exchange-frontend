import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WizardHeader from '../components/wizard/WizardHeader'
import WizardContent from '../components/wizard/WizardContent'
import WizardResults from '../components/wizard/WizardResults'
import ClientOnly from '../lib/ClientOnly'
import { Loading, Error } from '../components/shared/FetchStatus'
import { SECTOR_SEARCH_QUERY } from '../queries/sector'
import { WIZARD_COUNTRY_QUERY, WIZARD_SDG_QUERY, WIZARD_TAG_QUERY } from '../queries/wizard'

const WizardPageDefinition = () => {
  const [stage, setStage] = useState(0)
  const [allValues, setAllValues] = useState({
    projectPhase: '',
    sector: '',
    sectorSlug: null,
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

  const { loading: sectorLoading, error: sectorError, data: sectorData } = useQuery(SECTOR_SEARCH_QUERY, { variables: { locale, search: '' } })
  const { loading: sdgLoading, error: sdgError, data: sdgData } = useQuery(WIZARD_SDG_QUERY)
  const { loading: countryLoading, error: countryError, data: countryData } = useQuery(WIZARD_COUNTRY_QUERY)
  const { loading: tagLoading, error: tagError, data: tagData } = useQuery(WIZARD_TAG_QUERY)
  if (sectorLoading || sdgLoading || countryLoading || tagLoading) {
    return <Loading />
  }

  if (sectorError || sdgError || countryError || tagError) {
    return <Error />
  }

  const mobileServices = ['Airtime', 'API', 'HS', 'Mobile-Internet', 'Mobile-Money', 'Ops-Maintenance', 'OTT', 'SLA', 'SMS', 'User-Interface', 'USSD', 'Voice']
  const projData = { sectors: [], countries: [], mobileServices: [], tags: [], buildingBlocks: [] }
  projData.sectors = sectorData?.sectors.map((sector) => { return { label: sector.name, value: sector.name, slug: sector.slug } })
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

const WizardPage = () => (
  <>
    <Header />
    <ClientOnly>
      <WizardPageDefinition />
    </ClientOnly>
    <Footer />
  </>
)

export default WizardPage

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
import { BUILDING_BLOCK_SEARCH_QUERY } from '../queries/building-block'
import { MaturityStatus } from '../lib/constants'

const WizardPageDefinition = () => {
  const [stage, setStage] = useState(0)
  const [allValues, setAllValues] = useState({
    projectPhase: '',
    sectors: [],
    sdgs: [],
    useCase: '',
    countries: [],
    tags: [],
    mobileServices: [],
    buildingBlocks: [],
    productSortHint: '',
    projectSortHint: '',
    playbookSortHint: '',
    datasetSortHint: ''
  })
  const router = useRouter()
  const { locale } = router

  const { loading: sectorLoading, error: sectorError, data: sectorData }
    = useQuery(SECTOR_SEARCH_QUERY, { variables: { locale, search: '' } })
  const { loading: sdgLoading, error: sdgError, data: sdgData } = useQuery(WIZARD_SDG_QUERY)
  const { loading: countryLoading, error: countryError, data: countryData } = useQuery(WIZARD_COUNTRY_QUERY)
  const { loading: tagLoading, error: tagError, data: tagData } = useQuery(WIZARD_TAG_QUERY)
  const {
    loading: buildingBlocksLoading,
    error: buildingBlocksError,
    data: buildingBlocksData
  } = useQuery(BUILDING_BLOCK_SEARCH_QUERY, { variables: { search: '' } })

  if (sectorLoading || sdgLoading || countryLoading || tagLoading || buildingBlocksLoading) {
    return <Loading />
  }

  if (sectorError || sdgError || countryError || tagError || buildingBlocksError) {
    return <Error />
  }

  const mobileServices = [
    'Airtime',
    'API',
    'HS',
    'Mobile-Internet',
    'Mobile-Money',
    'Ops-Maintenance',
    'OTT',
    'SLA',
    'SMS',
    'User-Interface',
    'USSD',
    'Voice'
  ]
  const wizardData = {
    sectors: sectorData?.sectors.map((sector) => ({ label: sector.name, value: sector.name, slug: sector.slug })) ?? [],
    sdgs: sdgData.sdgs.map((sdg) => ({ label: sdg.name, value: sdg.name, slug: sdg.slug })) ?? [],
    countries: countryData.countries.map((country) => ({ label: country.name, value: country.name })) ?? [],
    mobileServices: mobileServices.map((service) => ({ label: service, value: service })) ?? [],
    tags: tagData.tags.map((tag) => ({ label: tag.name, value: tag.name })) ?? [],
    buildingBlocks: [
      ...buildingBlocksData.buildingBlocks?.filter(({ maturity }) => maturity === MaturityStatus.PUBLISHED) ?? [],
      ...buildingBlocksData.buildingBlocks?.filter(({ maturity }) => maturity === MaturityStatus.DRAFT) ?? []
    ] ?? []
  }

  return (
    <>
      <WizardHeader stage={stage} setStage={setStage} />
      {stage < 4
        ? <WizardContent
          stage={stage}
          setStage={setStage}
          wizardData={wizardData}
          allValues={allValues}
          setAllValues={setAllValues}
        />
        : <WizardResults
          stage={stage}
          setStage={setStage}
          allValues={allValues}
          setAllValues={setAllValues}
        />
      }
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

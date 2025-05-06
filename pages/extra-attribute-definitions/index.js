import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ExtraAttributeDefinitionRibbon from '../../components/extra-attribute-definition/ExtraAttributeDefinitionRibbon'
import ExtraAttributeDefinitionTabNav from '../../components/extra-attribute-definition/ExtraAttributeDefinitionTabNav'
import ExtraAttributeDefinitionMain from '../../components/extra-attribute-definition/ExtraAttributeDefinitionMain'

const ExtraAttributeDefinitionListPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.extraAttributeDefinition.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.extraAttributeDefinition.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ExtraAttributeDefinitionRibbon />
          <ExtraAttributeDefinitionTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ExtraAttributeDefinitionMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default ExtraAttributeDefinitionListPage

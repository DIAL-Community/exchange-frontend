import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import RubricCategoryRibbon from '../../components/rubric-category/RubricCategoryRibbon'
import RubricCategoryTabNav from '../../components/rubric-category/RubricCategoryTabNav'
import RubricCategoryMain from '../../components/rubric-category/RubricCategoryMain'

const RubricCategories = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.rubricCategory.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.rubricCategory.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <RubricCategoryRibbon />
          <RubricCategoryTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <RubricCategoryMain activeTab={activeTab} />
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

export default RubricCategories

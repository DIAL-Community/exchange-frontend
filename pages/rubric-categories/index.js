import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import RubricCategoryRibbon from '../../ui/v1/rubric-category/RubricCategoryRibbon'
import RubricCategoryTabNav from '../../ui/v1/rubric-category/RubricCategoryTabNav'
import RubricCategoryMain from '../../ui/v1/rubric-category/RubricCategoryMain'

const RubricCategories = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.sdg.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.sdg.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
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

export default RubricCategories

import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import GradientBackground from '../../../../components/shared/GradientBackground'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import UseCaseRibbon from '../../../../ui/v1/use-case/UseCaseRibbon'
import UseCaseTabNav from '../../../../ui/v1/use-case/UseCaseTabNav'
import UseCaseMain from '../../../../ui/v1/use-case/UseCaseMain'

const UseCaseListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('use-case.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('use-case.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <div className='flex flex-col'>
          <UseCaseRibbon />
          <UseCaseTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <UseCaseMain activeTab={activeTab} />
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default UseCaseListPage

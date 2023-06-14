import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import GradientBackground from '../../../../components/shared/GradientBackground'
import Header from '../../../../components/Header'
import ClientOnly from '../../../../lib/ClientOnly'
import Footer from '../../../../ui/v1/shared/Footer'
import ListScreen from '../../../../ui/v1/main/ListScreen'

const UseCaseList = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        <ListScreen />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default UseCaseList

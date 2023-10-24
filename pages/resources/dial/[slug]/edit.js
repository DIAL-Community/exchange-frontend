import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../components/dial/ResourceHeader'
import Footer from '../../../../components/dial/ResourceFooter'
import ResourceEdit from '../../../../components/dial/ResourceEdit'

const EditResourcePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.resource.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.resource.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceEdit slug={slug} locale={locale} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditResourcePage

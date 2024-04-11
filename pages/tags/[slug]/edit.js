import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import TagEdit from '../../../components/tag/TagEdit'

const EditTagPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.tag.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.tag.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <TagEdit slug={slug} locale={locale} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditTagPage

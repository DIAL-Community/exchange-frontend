import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../ui/v1/shared/Header'
import Footer from '../../../ui/v1/shared/Footer'
import PlaybookEdit from '../../../ui/v1/playbook/PlaybookEdit'
import { PlaybookDetailProvider } from '../../../ui/v1/playbook/context/PlaybookDetailContext'

function EditPlaybook () {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.playbook.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.playbook.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <PlaybookDetailProvider>
            <PlaybookEdit slug={slug} locale={locale} />
          </PlaybookDetailProvider>
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditPlaybook

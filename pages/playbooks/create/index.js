import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import PlaybookCreate from '../../../components/playbook/PlaybookCreate'

function CreatePlaybook () {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <PlaybookCreate />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreatePlaybook

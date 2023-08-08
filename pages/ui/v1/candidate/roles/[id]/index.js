import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../../../ui/v1/shared/Header'
import ClientOnly from '../../../../../../lib/ClientOnly'
import Footer from '../../../../../../ui/v1/shared/Footer'
import RoleDetail from '../../../../../../ui/v1/candidate/role/RoleDetail'

const RolePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { id } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.candidateRole.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateRole.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <RoleDetail id={id} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default RolePage

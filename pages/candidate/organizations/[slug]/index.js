import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../components/shared/Header'
import ClientOnly from '../../../../lib/ClientOnly'
import Footer from '../../../../components/shared/Footer'
import OrganizationDetail from '../../../../components/candidate/organization/OrganizationDetail'

const OrganizationPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.candidateOrganization.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateOrganization.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <OrganizationDetail slug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default OrganizationPage

import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../components/shared/Header'
import ClientOnly from '../../../../lib/ClientOnly'
import Footer from '../../../../components/shared/Footer'
import OrganizationCreate from '../../../../components/candidate/organization/OrganizationCreate'

const CreateOrganizationPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <OrganizationCreate />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateOrganizationPage

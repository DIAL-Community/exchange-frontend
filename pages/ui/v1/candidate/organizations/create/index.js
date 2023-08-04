import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../../../ui/v1/shared/Header'
import ClientOnly from '../../../../../../lib/ClientOnly'
import Footer from '../../../../../../ui/v1/shared/Footer'
import OrganizationCreate from '../../../../../../ui/v1/candidate/organization/OrganizationCreate'

const CreateOrganizationPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('organization.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('organization.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <OrganizationCreate />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateOrganizationPage

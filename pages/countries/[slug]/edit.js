import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import CountryEdit from '../../../components/country/CountryEdit'

const EditCountryPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.country.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.country.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <CountryEdit slug={slug} locale={locale} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default EditCountryPage

import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../../../../components/shared/Footer'
import Header from '../../../../../components/shared/Header'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import MenuConfigurations from '../../../../../components/site-setting/menu-configuration/MenuConfiguration'
import ClientOnly from '../../../../../lib/ClientOnly'

const MenuConfigurationsPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.siteSetting.menu.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.siteSetting.menu.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <MenuConfigurations slug={slug} />
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

export default MenuConfigurationsPage

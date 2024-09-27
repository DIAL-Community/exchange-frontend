import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import HealthHeader from '../../components/health/sections/HealthHeader'
import HealthFooter from '../../components/health/sections/HealthFooter'

const AboutPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('ui.product.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.product.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <HealthHeader />
        <div className='relative'>
          <img className='h-96 w-full' alt='DIAL DPI Resource Hub' src='/images/hero-image/health-cover.png' />
          <div className='absolute top-1/2 -translate-y-1/2 px-40 md:px-52 lg:px-64 text-dial-cotton'>
            <div className='flex flex-col gap-2 max-w-prose'>
              <div className='text-3xl leading-tight font-bold py-3'>
                About the Africa HealthTech Marketplace
              </div>
              <div className='max-w-prose'>
                The Africa CDC HealthTech Marketplace will showcase and connect digital health solutions
                that have been developed by African organizations with potential users, investors, and
                partners across the continent.
              </div>
            </div>
          </div>
        </div>
        <div className='lg:px-8 xl:px-56 py-8'>
          <div className='text-2xl leading-tight text-health-blue font-semibold'>
            Why a HealthTech Marketplace?
          </div>
          <div className='py-8 text-xl'>
            By creating a hub for innovative health technologies, the marketplace aims to accelerate
            the growth and development of an ecosystem of African digital health solutions and innovators.
            We expect this initiative to significantly boost the visibility of local health tech startups,
            facilitate collaborations, and ultimately improve healthcare delivery across Africa through
            increased adoption of effective digital solutions while boosting the growth and job creation
            potential of home-grown HealthTech startups. The marketplace is one piece in a large puzzle of
            efforts that Africa CDC is championing to promote home-grown HealthTech entrepreneurship.
          </div>
          <div className='text-2xl leading-tight text-health-blue font-semibold'>
            Vetting Process
          </div>
          <div className='py-8 text-xl'>
            Africa CDC and a Panel of digital health experts have developed a rubric that is used to
            determine whether a product can be listed. At a minimum, the product must address on
            or more Africn health use cases and must be deployed and used in at least one place in
            the African continent. For more information on the rubric, please see our&nbsp;
            <a href='https://www.africacdc.org/health-tech-marketplace/rubric' className='text-health-blue'>
              FAQ page
            </a>.
          </div>
          <div className='text-2xl leading-tight text-health-blue font-semibold'>
            Health Marketplace Expert Panel
          </div>
          <div className='py-8 text-xl'>
            We are thankful for the support of our Expert Panel, who helped establish the criteria and
            standards for the HealthTech Marketplace. Several of the Expert Panel members also supported
            the work of vetting solutions
            <br /><br />
            Expert Panel members include:
            <br /><br />
            <ul className='list-disc list-inside'>
              <li>Abimbola</li>
              <li>Esperance</li>
              <li>James</li>
              <li>Olivier</li>
            </ul>
          </div>
        </div>

        <HealthFooter />
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

export default AboutPage

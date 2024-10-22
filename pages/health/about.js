import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Link from 'next/link'
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
          <img className='h-96 w-full hidden md:block' alt='DIAL DPI Resource Hub'
            src='/images/hero-image/health-cover.png' />
          <div className='h-96 w-full block md:hidden bg-health-green'></div>
          <div className='absolute top-1/2 -translate-y-1/2 px-16 md:px-52 lg:px-64 text-dial-cotton'>
            <div className='flex flex-col gap-2 max-w-prose'>
              <div className='text-3xl leading-tight font-bold py-3'>
                About the Africa HealthTech Marketplace
              </div>
              <div className='max-w-prose'>
                The Africa HealthTech Marketplace will showcase and connect digital health solutions
                that have been developed by African organizations with potential users, investors, and
                partners across the continent.
              </div>
            </div>
          </div>
        </div>
        <div className='px-8 xl:px-56 py-8'>
          <div className='text-2xl leading-tight text-health-blue font-semibold'>
            Why an Africa HealthTech Marketplace?
          </div>
          <div className='py-8 text-lg'>
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
          <div className='py-8 text-lg'>
            Africa CDC and a Panel of digital health experts have developed a rubric that is used to
            determine whether a product can be listed. At a minimum, the product must address one
            or more African health use cases and must be deployed and used in at least one place in
            the African continent. For more information on the rubric, please see our&nbsp;
            <Link href='/health/faq' className='text-health-blue'>
              FAQ page
            </Link>.
            <br /><br />
            Solutions that met these minimum criteria were submitted to the Expert Advisory Group for further
            review. Each solution met with the Expert Advisory Group for a 30-minute presentation. Based on
            the information provided, the Expert Advisory Group recommended which solutions met the criteria
            for inclusion in the Africa HealthTech Marketplace.
          </div>
          <div className='text-2xl leading-tight text-health-blue font-semibold'>
            Health Marketplace Expert Advisory Group
          </div>
          <div className='py-8 text-lg'>
            Africa CDC and the Digital Impact Alliance convened a panel of experts to establish the
            criteria and standards for the Africa HealthTech Marketplace. Several of these experts also supported
            the work of vetting solutions and providing feedback on which solution should be included
            in the Marketplace.
            <br /><br />
            We would like to thank the Expert Advisory Group for their time and support of this work:
            <br /><br />
            <ul className='list-disc list-inside'>
              <li>Abimbola Adebakin, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://advantagehealthafrica.com/' >Advantage Health Africa</a></li>
              <li>Nassir Idriss ADAM, National Digital Health Program, Chad</li>
              <li>Fatou Fall, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://digitalsquare.org/'>Digital Square at Path</a></li>
              <li>James Fraser, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://www.madiro.org/'>Madiro</a></li>
              <li>Olivier Habumugisha, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://www.jhpiego.org/'>Jhpiego</a></li>
              <li>Dr. Esperance Luvindao, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://osaatafrica.com/'>Osaat Africa Health Foundation</a></li>
              <li>Caroline Mbindyo, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://amref.org/'>Amref Health Innovations</a></li>
              <li>Wilfred Ngagi, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://villgroafrica.org/'>Villgro Africa</a></li>
              <li>Chris Seebregts, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://www.jembi.org/'>Jembi Health Systems</a></li>
              <li>Mara Hansen Staples, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://www.salientadvisory.com/'>Salient Advisory</a></li>
              <li>Sewu-Steve Tawia, <a className='text-health-blue' target='_blank' rel='noreferrer'
                href='https://jazarift.com/'>Jaza Rift Ventures</a></li>
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

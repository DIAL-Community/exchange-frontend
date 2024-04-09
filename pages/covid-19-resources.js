import { useIntl, FormattedMessage } from 'react-intl'
import Link from 'next/link'
import ClientOnly from '../lib/ClientOnly'
import QueryNotification from '../components/shared/QueryNotification'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'

const jsphUrl = 'https://www.jhsph.edu/departments/international-health/news/johns-hopkins-researchers-publish' +
'-assessment-of-digital-solutions-for-covid-19-response-in-low-and-middle-income-countries.html'

const pathZoomUrl = 'https://path.zoom.us/rec/play/vpJ4cLqop243HILDuASDAvYrW9S7K6usgScb8_UEzRm8VXAGNlamNeBBM' +
'bbewJNnd8VplC77G3m4hu0O?autoplay=true&startTime=1585575432000'

const unPandemicUrl = 'https://publicadministration.un.org/egovkb/Portals/egovkb/Documents/un/2020-Survey/' +
'UNDESA%20Compendium%20of%20Digital%20Government%20Initiatives%20in%20Response%20to%20the%20COVID-19%20Pandemic.pdf'

const Content = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  return (
    <div className='px-4 mx-auto my-8 max-w-screen-xl'>
      <div className='my-4'>
        <div className='text-2xl mt-8 lg:mt-16 mb-4 lg:mb-12 font-semibold'>
          {format('covid.title')}
        </div>
        <div className='my-8 pb-4 flex flex-col text-base border-b border-dial-gray-dark'>
          <p className='text-justify'>
            {format('covid.description')}
          </p>
          <ul className='mx-6 my-3 list-disc'>
            <li className='text-justify'>
              {format('covid.description.firstArea')}
            </li>
            <li className='text-justify'>
              {format('covid.description.secondArea')}
            </li>
            <li className='text-justify'>
              {format('covid.description.thirdArea')}
            </li>
          </ul>
          <div className='my-8'>
            <Link href='/products'
              className='px-8 py-4 rounded-full text-xl shadow-xl text-white bg-dial-sapphire'
            >
              {format('covid.exploreCatalog')}
            </Link>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4' id='products'>
          <div className='text-2xl'>
            {format('covid.firstArea.title')}
          </div>
          <div className='flex flex-col lg:flex-row gap-3'>
            <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
              <FormattedMessage
                id='covid.firstArea.firstText'
                values={{
                  p: chunks => <p className='text-justify mb-2'>{chunks}</p>,
                  firstLink: chunks =>
                    <a
                      className='mr-1 text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href='/products' target='_blank'
                    >
                      {chunks}
                    </a>
                }}
              />
            </div>
            <img
              className='lg:w-2/3 object-scale-down mb-auto'
              src='images/covid/covid-prod1.png'
              alt='Product list page with filter'
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-3 lg:mt-8'>
            <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
              <FormattedMessage
                id='covid.firstArea.secondText'
                values={{
                  p: chunks => <p className='text-justify mb-2'>{chunks}</p>,
                  b: chunks => <span className='font-semibold'>{chunks}</span>
                }}
              />
            </div>
            <img
              className='lg:w-2/3 object-scale-down mb-auto'
              src='images/covid/covid-prod2.png'
              alt='Product list page'
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-3 lg:mt-8'>
            <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
              <FormattedMessage
                id='covid.firstArea.thirdText'
                values={{
                  p: chunks => <p className='text-justify mb-2'>{chunks}</p>
                }}
              />
            </div>
            <img
              className='lg:w-2/3 object-scale-down mb-auto'
              src='/images/covid/covid-prod3.png'
              alt='Product detail page'
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 mt-8'>
          <div className='flex flex-col gap-4' id='mobile'>
            <div className='text-2xl'>
              Using the Online Catalog for Mobile Messaging Response
            </div>
            <div className='flex flex-col lg:flex-row gap-3'>
              <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
                <FormattedMessage
                  id='covid.secondArea.firstText'
                  values={{
                    p: chunks => <p className='text-justify mb-2'>{chunks}</p>,
                    b: chunks => <span className='font-semibold'>{chunks}</span>,
                    firstLink: chunks =>
                      <a
                        className='ml-1 text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                        href='/maps/aggregators' target='_blank'
                      >
                        {chunks}
                      </a>,
                    secondLink: chunks =>
                      <a
                        className='ml-1 text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                        href='/products' target='_blank'
                      >
                        {chunks}
                      </a>
                  }}
                />
              </div>
              <img
                className='lg:w-2/3 object-scale-down mb-auto'
                src='/images/covid/covid-agg1.png'
                alt='Aggregator map detailed section'
              />
            </div>
            <div className='flex flex-col lg:flex-row gap-3 lg:mt-8'>
              <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
                <FormattedMessage
                  id='covid.secondArea.secondText'
                  values={{
                    p: chunks => <p className='text-justify mb-2'>{chunks}</p>
                  }}
                />
              </div>
              <img
                className='lg:w-2/3 object-scale-down mb-auto'
                src='/images/covid/covid-agg2.png'
                alt='Aggregator map page'
              />
            </div>
            <div className='flex flex-col lg:flex-row gap-3 lg:mt-8'>
              <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
                <FormattedMessage
                  id='covid.secondArea.thirdText'
                  values={{
                    p: chunks => <p className='text-justify mb-2'>{chunks}</p>
                  }}
                />
              </div>
              <img
                className='lg:w-2/3 object-scale-down mb-auto'
                src='/images/covid/covid-agg4.png'
                alt='Aggregator list page'
              />
            </div>
            <div className='flex flex-col lg:flex-row gap-3 lg:mt-8'>
              <div className='w-full lg:max-w-1/3 flex flex-col mr-5 body-large'>
                <FormattedMessage
                  id='covid.secondArea.fourthText'
                  values={{
                    p: chunks => <p className='text-justify mb-2'>{chunks}</p>,
                    firstLink: chunks =>
                      <a
                        className='mx-1 text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                        href='http://exchange.dial.global/organizations?shareCatalog=true&aggregator=true'
                      >
                        {chunks}
                      </a>
                  }}
                />
              </div>
              <img
                className='lg:w-2/3 object-scale-down mb-auto'
                src='/images/covid/covid-agg3.png'
                alt='Aggregator detail page'
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 mt-8'>
          <div className='flex flex-col gap-4' id='resources'>
            <div className='text-2xl'>
              {format('covid.thirdArea.title')}
            </div>
            <div className='flex flex-col gap-3 body-large'>
              <FormattedMessage
                id='covid.thirdArea.firstText'
                values={{
                  div: chunks => <div className='text-justify'>{chunks}</div>,
                  ul: chunks => <ul className='mx-6 list-disc'>{chunks}</ul>,
                  li: chunks => <li>{chunks}</li>,
                  jsphLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href={jsphUrl} target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>,
                  cdcLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href='https://www.cdc.gov/coronavirus/2019-ncov/global-covid-19/compare-digital-tools.html'
                      target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>,
                  pathLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href={pathZoomUrl} target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>,
                  deckLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href='https://drive.google.com/file/d/14bqGbDwXnMNWSAZMNUmGLCbcFkIsjPVU/view'
                      target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>,
                  digiSquareLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href='https://wiki.digitalsquare.io/index.php/Main_Page#Global_Good_Adaptations_to_COVID-19'
                      target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>,
                  newAmericaLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href='https://newamericafoundation.github.io/pandemic-response-repository/'
                      target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>,
                  unPandemicLink: chunks =>
                    <a
                      className='text-dial-sunshine border-b border-transparent hover:border-dial-sunshine'
                      href={unPandemicUrl} target='_blank' rel='noreferrer'
                    >
                      {chunks}
                    </a>
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Covid19Resources = () => (
  <>
    <ClientOnly clientTenant='default'>
      <QueryNotification />
      <Header />
      <Content />
      <Footer />
    </ClientOnly>
  </>
)

export default Covid19Resources

import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import parse from 'html-react-parser'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import HealthHeader from '../../components/health/sections/HealthHeader'
import HealthFooter from '../../components/health/sections/HealthFooter'

const faqs = [
  { question: 'What are the criteria for listing a product in the HealthTech Marketplace?',
    answer: 'Africa CDC and our Expert Panel have developed a rubric that is used to \
    determine whether a product can be listed. At a minimum, the product must address on \
    or more Africn health use cases and must be deployed and used in at least one place in \
    the African continent. Beyond that, the rubric looks at several other criteria and indicators  \
    to help provide deep information '
  },
  { question:'How are solutions vetted?',
    answer: 'All products are vetted by a panel of experts from Africa CDC and various digital \
    health initiatives.'
  },
  { question:'How do I find a solution to match my needs?',
    answer: 'The Marketplace offers the ability to search for health solutions in different \
    categories. Within each category, you can filter by different software features that your \
    project requires.'
  },
  { question:'How do I get more information about a particular solution?',
    answer: 'The solution detail page provides a wide range of information. We also list contact \
    information for the solution provider.'
  },
  { question:'How is this different than other lists of health solutions, like Digital Square Global \
    Goods or the Digital Public Goods Alliance?',
  answer: 'there are other platforms that feature Digital Public Goods and open source health solutions. \
  Our focus is around entrepreneurs and local innovation, providing visibility for these solutions. \
  For a list of open source health solutions vetted by Digital Square, please visit \
  <a href="https://exchange.dial.global/products?shareCatalog=true&origins=2--Digital%20Square" \
  target="_blank" rel="noreferrer">this page</a>'
  },
  { question:'What about DPGs?',
    answer: 'Facility scales are used to show what features should be available for different \
    sizes of health facilities.'
  },
  { question:'What is a facility scale?',
    answer: 'Facility scales are used to show what features should be available for different \
    sizes of health facilities.'
  }
]

const FaqExpander = ({ question, answer }) => {

  const [showFilter, setShowFilter] = useState(false)

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='py-4'>
      <a href='#' onClick={toggleFilter}>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto inline' size={24} />
          : <BsPlus className='ml-auto text-dial-stratos my-auto inline' size={24} />
        }
        <div className='text-dial-stratos text-lg ml-3 inline'>
          {question}
        </div>
      </a>
      {showFilter && <div className='text-dial-stratos text-lg py-2 ml-9'>
        {parse(answer)}
      </div>}
    </div>
  )
}

const FaqPage = ({ defaultTenants }) => {
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
                Frequently Asked Questions
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
          <div className='py-8 text-xl'>
            {faqs.map((faq, index) => {
              return (<FaqExpander key={index} question={faq.question} answer={faq.answer} />)
            })}
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

export default FaqPage

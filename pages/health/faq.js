import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import HealthHeader from '../../components/health/sections/HealthHeader'
import HealthFooter from '../../components/health/sections/HealthFooter'

const faqs = [
  { question: 'How do you determine what products are listed in the Marketplace?',
    answer: 'Africa CDC and our Expert Panel have developed a rubric that is used to \
    determine whether a product can be listed. At a minimum, the product must address on \
    or more Africn health use cases and must be deployed and used in at least one place in \
    the African continent'
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
    <div className='gap-y-3'>
      <a href='#' onClick={toggleFilter}>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto inline' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto inline' />
        }
        <div className='text-dial-stratos text-lg py-2 inline'>
          {question}
        </div>
      </a>
      {showFilter && <div className='text-dial-stratos text-lg py-2'>
        {answer}
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
        <div className='lg:px-8 xl:px-56 py-8'>
          <div className='text-3xl leading-tight text-health-blue font-bold'>
            Frequently Asked Questions
          </div>
          <div className='py-8 text-xl'>
            {faqs.map((faq) => {
              return (<FaqExpander question={faq.question} answer={faq.answer} />)
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

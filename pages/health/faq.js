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
  { question: 'What are the criteria for listing a product in the Africa HealthTech Marketplace?',
    answer: 'Africa CDC and our Expert Advisory Group have developed a rubric that is used to \
    determine whether a product can be listed. At a minimum, the product must address one \
    or more African health use cases and must be deployed and used in at least one place in \
    the African continent. Beyond that, the rubric looks at several other criteria and indicators  \
    to help provide a rich set of information about the solution, including the number of deployments, \
    number of active users, countries where the solution is deployed. We collect data about the \
    design, architecture, and security of the solution, as well as collecting data about the \
    specific features and functionality of the solution.<br /><br />To view the complete rubric, \
    click on this link: \
    <a className="text-health-blue" target="_blank" rel="noreferrer" \
      href="https://docs.google.com/spreadsheets/d/1nvH5ZTRq76Qp3QCOc-KgeW07k46dtztpZa4T6yF5HFc/edit?usp=sharing"> \
    Africa HealthTech Marketplace Rubric</a>'
  },
  { question:'What is the process for vetting digital health solutions?',
    answer: 'Solutions are invited to apply for participation in the Africa HealthTech Marketplace by a member \
    of the Expert Advisory Group. Solution providers fill out a detailed form which provides information about their \
    digital health solution. Solutions which meet the minimum criteria for inclusion are then invited to \
    a demo and vetting session with advisory group members. Following that session, the Expert Advisory Group \
    members determine whether the solution is qualified for inclusion based on the evaluation rubric. \
    <br /><br />If you are a solution provider who would like to be considered for inclusion, send us a message \
    using the email link at the bottom of this page.'
  },
  { question:'How do I find a solution to match my needs?',
    answer: 'The Marketplace offers the ability to search for health solutions in different \
    categories. Within each category, you can filter by different software features that your \
    project requires. Use the search bar on the <a className="text-health-blue" \
    href="/health/products">Products</a> page to search for \
    solutions by category, or just enter a keyword in the search bar to find a solution.'
  },
  { question:'How do I get more information about a particular solution?',
    answer: 'The solution detail page provides a wide range of information about each digital health innovation, \
    including information about where the solution has been deployed and detailed information about what the solution \
    does and its impact on the African health ecosystem. We also list contact \
    information for the solution provider, allowing users to reach out for additional information or a demot of \
    the solution .'
  },
  { question:'What about other open source health solutions, like Digital Square Global Goods?',
    answer: 'There are many fantastic open source solutions that have been designed to address health use cases. \
    Many of these solutions have been widely used across the African continent. However, the focus if the HealthTech \
    Marketplace is to showcase local innovation, and solutions that have been designed by African entrepreneurs to \
    address use cases that they have identified. \
    <br /><br />For a list of open source health solutions vetted by Digital Square, please visit \
    <a href="https://globalgoodsguidebook.org/" \
    className="text-health-blue" target="_blank" rel="noreferrer">this page</a>'
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
        <div className='text-dial-stratos text-lg font-semibold text-health-blue ml-3 inline'>
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

  function obfuscateEmail(email) {
    return email?.split('').map(char => `&#${char.charCodeAt(0)};`).join('')
  }

  const decodedEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const obfuscatedEmail = obfuscateEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL)

  return (
    <>
      <NextSeo
        title={format('health.title')}
        description={format('seo.health.description.about')}
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
                Frequently Asked Questions
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
          <div className='py-8 text-xl'>
            {faqs.map((faq, index) => {
              return (<FaqExpander key={index} question={faq.question} answer={faq.answer} />)
            })}
          </div>
        </div>
        <div className='px-8 xl:px-56 py-8'>
          For more information, please contact us using this link:
          { decodedEmail && obfuscatedEmail && (
            <a
              href={`mailto:${decodedEmail}`}
              dangerouslySetInnerHTML={{ __html: 'Email Us' }}
              className='pl-2 text-health-blue'
              onClick={(e) => {
                if (!decodedEmail) {
                  e.preventDefault()
                }
              }}/>
          )}
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

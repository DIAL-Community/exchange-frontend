import { useRouter } from 'next/router'
import GradientBackground from '../../components/shared/GradientBackground'

const BBFullScreen = () => {

  const router = useRouter()

  const all_bb_desc = [
    { name: 'Analytics and Business Intelligence',
      status: 'future',
      slug: 'analytics_and_business_intel',
      desc: 'Provides data-driven insights about business processes, performance and predictive modelling.' },
    { name: 'Artificial Intelligence',
      status: 'future',
      desc: 'AI capabilities packaged as reusable services to perform work, extract insights from data, or ' +
            'provide other business capabilities.' },
    { name: 'Client Case Management',
      status: 'future',
      desc: 'Registration of a client and the longitudinal tracking of services for the client, often across ' +
            'multiple service categories, providers and locations.' },
    { name: 'Collaboration Management',
      status: 'future',
      desc: 'Enables multiple users to simultaneously access, modify or contribute to a single activity, such as ' +
            'content creation, through a unified portal.' },
    { name: 'Consent Management',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-consent/',
      desc: 'Manages a set of policies allowing users to determine the info that will be accessible to specific ' +
            'potential info consumers, for which purpose, for how long and whether this info can be shared.<br/>' },
    { name: 'Content Management',
      status: 'future',
      desc: 'Supports the creation, editing, publication and management of digital media and other information.' },
    { name: 'Data Collection',
      status: 'future',
      desc: 'Supports data collection from humans, sensors and other systems through digital interfaces.' },
    { name: 'Digital Registries',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-digital-registries/',
      desc: 'Registries are centrally managed databases that uniquely identify persons, vendors, procedures, ' +
            'products and sites related to an organization or activity.' },
    { name: 'eLearning',
      status: 'future',
      desc: 'Supports facilitated or remote learning through digital interaction between educators and students.' },
    { name: 'eMarketplace',
      status: 'working',
      desc: 'Provides a digital marketing space where provider entities can electronically advertise & sell ' +
            'products & services to other entities (B2B) or end-customers (B2C).' },
    { name: 'Geographic Information Services (GIS)',
      status: 'working',
      slug: 'geographic_information_services',
      desc: 'Provides functionality to identify, tag and analyze geographic locations of an object, such as a ' +
            'water source, building, mobile phone or medical commodity.' },
    { name: 'Identification and Authentication',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-identity/',
      desc: 'Enables unique identification and authentication of users, organizations and other entities.' },
    { name: 'Information Mediator',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-information-mediation/',
      desc: 'Provides a gateway between external digital apps & ICT Building Blocks, ensuring implementation of ' +
            'standards, for integrating various ICT Building Blocks & apps.' },
    { name: 'Messaging',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-messaging/',
      desc: 'Facilitates notifications, alerts and two-way communications between applications and communications ' +
            'services, including SMS, USSD, IVR, email and social media platforms.' },
    { name: 'Mobility Management',
      status: 'future',
      desc: 'Services to securely enable employees’ use and management of mobile devices and applications in a ' +
            'business context.' },
    { name: 'Payments',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-messaging/',
      desc: 'Implements financial transactions (e.g., remittances, claims, purchases & payments, transactional ' +
            'info). Tracking costs utilities & audit trials.' },
    { name: 'Registration',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-registration/',
      desc: 'Records identifiers and general information about a person, place or entity, typically for the purpose ' +
            'of registration  in specific services or programmes and tracking of that entity over time.' },
    { name: 'Reporting and Dashboards',
      status: 'future',
      desc: 'Provides pre-packaged and custom presentations of data and summaries of an organization’s pre-defined ' +
            'key performance metrics, often in visual format.' },
    { name: 'Scheduling',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-scheduler/',
      desc: 'Provides an engine for setting up events based on regular intervals or specific combinations of status ' +
            'of several parameters in order to trigger specific tasks in an automated business process.' },
    { name: 'Security',
      status: 'published',
      url: 'https://govstack.gitbook.io/specification/security-requirements',
      desc: 'Allows ICT admins to centrally configure & manage user access permissions to network ' +
            'resources, services, databases, apps and devices. Enables secure info exchange between apps.' },
    { name: 'Shared Data Repositories',
      status: 'future',
      desc: 'Shared space to store data for a specified knowledge area that external applications use, ' +
            'often providing domain-specific functionality and data presentations.' },
    { name: 'Terminology',
      status: 'future',
      desc: 'Registry of definitions with defined standards, synonyms for a particular domain of knowledge ' +
            '(eg agriculture), used to facilitate semantic interoperability.' },
    { name: 'Workflow and Algorithm',
      status: 'published',
      url: 'https://govstack.gitbook.io/bb-workflow/',
      desc: 'Optimize business processes by specifying rules that govern the sequence of activities executed, ' +
            'the type of info exchanged  to orchestrate the process flow from initiation to completion.' }
  ]

  const bb_status = router.query?.status ? router.query.status : 'future'

  const getSlug = (bb) => {
    return bb.slug ? bb.slug :
      bb.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').replace(/^-+|-+$/g, '').substring(0,32)
  }

  const getUrl = (bb) => {
    return bb.url ? bb.url :
      `https://exchange.dial.global/building_blocks/${getSlug(bb)}`
  }

  const currBBList = () => {
    return all_bb_desc.filter( (bb) => {
      return bb.status === bb_status
    })
  }

  return (
    <>
      <GradientBackground />
      <div className='grid grid-cols-4 col-lg-3 col-md-4 d-flex mt-2'>
        { currBBList().map((bb, i) => {
          return (
            <div key={i} className='m-2'>
              <a href={getUrl(bb)} target='_blank' rel='noreferrer'>
                <div className='h-full flex flex-col border border-dial-gray hover:border-dial-sunshine shadow-md'>
                  <div
                    className={`
                      text-2xl text-white font-semibold overflow-hidden h-1/5 w-full flex flex-row gap-x-1.5 p-2
                      border-b border-dial-gray product-card-header ${bb_status ? bb_status : 'future'}
                    `}
                  >
                    {bb.name}
                  </div>
                  <div className='flex flex-col p-4 h-1/2'>
                    <div className='mx-auto py-4 w-1/2'>
                      <img
                        src={`https://exchange.dial.global/assets/building_blocks/${getSlug(bb)}.png`}
                        alt='building block image'
                      />
                    </div>
                  </div>
                  <div className='border bg-dial-gray p-2 h-1/3 overflow-hidden'>
                    {bb.desc}
                  </div>
                </div>
              </a>
            </div>)
        })}
      </div>
    </>
  )
}

export default BBFullScreen

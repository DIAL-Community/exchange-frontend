import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const HealthBody = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <div className='relative'>
        <img className='h-96 w-full' alt='DIAL DPI Resource Hub' src='/images/hero-image/health-cover.png' />
        <div className='absolute top-1/2 -translate-y-1/2 px-40 md:px-52 lg:px-64 text-dial-cotton'>
          <div className='flex flex-col gap-2 max-w-prose'>
            <div className='text-3xl leading-tight font-bold py-3'>
              {format('health.landing.main.title')}
            </div>
            <div className='text-3xl'>
              {format('health.landing.main.subtitle')}
            </div>
            <div className='max-w-prose'>
              {format('health.landing.main.powered')}
            </div>
          </div>
        </div>
      </div>
      <div className='bg-health-light-gray flex'>
        <div className='w-1/2 pl-4 lg:pl-8 xl:pl-56 pr-12 py-12 text-health-blue text-lg'>
          The Africa HealthTech Marketplace showcases innovative digital health solutions that have been
          rigorously vetted by renowned global experts in digital health, including representatives from
          governments, investors, entrepreneurs, and ecosystem builders. These solutions are assessed for
          their alignment with African health security priorities, scalability, sustainability, and technical
          robustness—covering critical factors such as data privacy, interoperability, and operational
          efficiency. The solutions presented offer the potential to enhance health outcomes, particularly
          in terms of accessibility, affordability, and quality of care. While inclusion in the Marketplace
          reflects recognition of a solution’s strengths and potential, it does not imply endorsement by Africa CDC.
        </div>
        <img className='h-120 w-1/2' alt='Africa CDC Health Marketplace' src='ui/health/landing-img1.png' />
      </div>
    </>
  )
}

export default HealthBody

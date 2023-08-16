import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const WizardDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='relative h-[400px] lg:h-[297px]'>
      <div className='absolute top-0 left-0 w-full h-[400px] lg:h-[297px] bg-dial-white-linen' />
      <div className='absolute top-0 left-0 w-full h-[400px] lg:h-[297px]'>
        <div
          className='bg-cover lg:bg-auto bg-right bg-no-repeat h-[400px] lg:h-[297px]'
          style={{ backgroundImage: 'url("/ui/v1/wizard-bg.svg")' }}
        >
          <div className='lg:px-8 xl:px-56'>
            <div className='flex flex-col gap-y-6'>
              <div className='text-2xl font-semibold mt-12'>
                {format('ui.wizard.title')}
              </div>
              <div className='max-w-5xl'>
                {format('ui.wizard.tagLine')}
              </div>
              <div className='flex text-sm text-dial-stratos'>
                <Link href='/wizard' className='rounded px-5 py-2.5 bg-dial-sunshine'>
                  {format('ui.wizard.launch')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WizardDefinition

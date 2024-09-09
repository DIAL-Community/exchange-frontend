import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const HubWizardDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='relative h-[400px] lg:h-[297px]'>
      <div className='absolute top-0 left-0 w-full h-[400px] lg:h-[297px]' />
      <div className='absolute top-0 left-0 w-full h-[400px] lg:h-[297px]'>
        <div className='lg:px-8 xl:px-56'>
          <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-6'>
            <div className='text-2xl font-semibold mt-12 text-center'>
              {format('ui.hub.wizard.title')}
            </div>
            <div className='max-w-5xl text-center'>
              {format('ui.hub.wizard.tagLine')}
            </div>
            <div className='text-sm text-dial-stratos flex justify-center'>
              <Link href='/wizard' className='rounded px-5 py-2.5 bg-dial-sunshine intro-wizard'>
                {format('ui.wizard.launch')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubWizardDefinition

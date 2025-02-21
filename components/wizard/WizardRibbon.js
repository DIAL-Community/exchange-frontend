import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const WizardRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div
      className='bg-cover bg-no-repeat ribbon-outer h-[8.5rem] rounded-b-[32px] z-40'
      style={{ backgroundImage: 'url("/ui/v1/wizard-bg.svg")' }}
    >
      <div className='ribbon-inner px-4 lg:px-8 xl:px-24 3xl:px-56 h-full mt-4'>
        <div className='flex gap-4 h-full items-center'>
          <div className='flex items-center justify-center rounded-full bg-dial-orange h-[70px] w-[70px]'>
            <img
              src='/ui/v1/wizard-header.svg'
              alt={format('ui.image.logoAlt', { name: format('ui.wizard.label') })}
              width={40}
              height={40}
              className='object-contain white-filter'
            />
          </div>
          <div className='text-2xl font-base dial-bg-plum my-auto flex-grow'>
            {format('landing.wizard.title')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WizardRibbon

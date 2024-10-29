import { useIntl } from 'react-intl'
import { useCallback, useContext } from 'react'
import { SectorAutocomplete } from '../parameters/Sector'
import { SdgActiveFilters, SdgAutocomplete } from '../parameters/Sdg'
import { WizardContext, WizardDispatchContext } from '../WizardContext'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../parameters/UseCase'

const WizardParameterContent = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { useCases, sectors, sdgs } = useContext(WizardContext)
  const { setUseCases, setSectors, setSdgs } = useContext(WizardDispatchContext)

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='flex flex-col gap-y-6'>
        <hr className='border-b border-4 border-dial-blue-chalk' />
        <div className='text-sm pt-3 pb-12'>
          <div className='flex flex-wrap w-full gap-y-4'>
            <div className='lg:order-1 lg:basis-1/3 shrink-0 flex flex-col gap-y-2 lg:pr-6'>
              <div className='font-semibold'>{format('ui.wizard.useCase.question')}</div>
              <div className='text-xs'>{format('ui.wizard.useCase.question.subtitle')}</div>
            </div>
            <div className='lg:order-4 lg:basis-1/3 shrink-0 w-full lg:pr-6'>
              <div className='flex flex-col gap-y-4'>
                <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
                <div className='flex flex-col gap-y-1'>
                  <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
                </div>
              </div>
            </div>
            <div className='lg:order-2 lg:basis-1/3 shrink-0 flex flex-col gap-y-2 lg:px-3'>
              <div className='font-semibold'>{format('ui.wizard.sector.question')}</div>
              <div className='text-xs'>({format('ui.wizard.sector.question.subtitle')})</div>
            </div>
            <div className='lg:order-5 lg:basis-1/3 shrink-0 w-full lg:px-3'>
              <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
            </div>
            <div className='lg:order-3 lg:basis-1/3 shrink-0 flex flex-col gap-y-2 lg:pl-6'>
              <div className='font-semibold'>{(format('ui.wizard.sdg.question'))}</div>
              <div className='text-xs'>{(format('ui.wizard.sdg.question.subtitle'))}</div>
            </div>
            <div className='lg:order-6 lg:basis-1/3 shrink-0 w-full lg:pl-6'>
              <div className='flex flex-col gap-y-4'>
                <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
                <div className='flex flex-col gap-y-1'>
                  <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WizardParameterContent

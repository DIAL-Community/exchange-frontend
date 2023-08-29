import { useContext } from 'react'
import { SectorAutocomplete } from '../parameters/Sector'
import { SdgActiveFilters, SdgAutocomplete } from '../parameters/Sdg'
import { WizardContext, WizardDispatchContext } from '../WizardContext'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../parameters/UseCase'

const WizardParameterContent = () => {
  const { useCases, sectors, sdgs } = useContext(WizardContext)
  const { setUseCases, setSectors, setSdgs } = useContext(WizardDispatchContext)

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='flex flex-col gap-y-6'>
        <hr className='border-b border-4 border-dial-blue-chalk' />
        <div className='text-sm pt-3 pb-12'>
          <div className='flex flex-wrap w-full gap-y-4'>
            <div className='lg:order-1 lg:basis-1/3 flex flex-col gap-y-2 lg:pr-6'>
              <div className='font-semibold'>Select a specific Use case, if applicable</div>
              <div className='text-xs'>What is a Use case?</div>
            </div>
            <div className='lg:order-4 lg:basis-1/3 w-full lg:pr-6'>
              <div className='flex flex-col gap-y-4'>
                <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
                <div className='flex flex-col gap-y-1'>
                  <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
                </div>
              </div>
            </div>
            <div className='lg:order-2 lg:basis-1/3 flex flex-col gap-y-2 lg:px-3'>
              <div className='font-semibold'>Select the sector that your project supports</div>
              <div className='text-xs'>(You can select multiple sectors)</div>
            </div>
            <div className='lg:order-5 lg:basis-1/3 w-full lg:px-3'>
              <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
            </div>
            <div className='lg:order-3 lg:basis-1/3 flex flex-col gap-y-2 lg:pl-6'>
              <div className='font-semibold'>Select any SDGs that your project is designed to support</div>
              <div className='text-xs'>Learn more about SDGs</div>
            </div>
            <div className='lg:order-6 lg:basis-1/3 w-full lg:pl-6'>
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

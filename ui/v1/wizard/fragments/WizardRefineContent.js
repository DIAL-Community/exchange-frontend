import { useContext } from 'react'
import { TagActiveFilters, TagAutocomplete } from '../parameters/Tag'
import { WizardContext, WizardDispatchContext } from '../WizardContext'
import { CountryActiveFilters, CountryAutocomplete } from '../parameters/Country'
import { MobileServiceActiveFilters, MobileServiceAutocomplete } from '../parameters/MobileService'

const WizardRefineContent = () => {
  const { countries, tags, mobileServices } = useContext(WizardContext)
  const { setCountries, setTags, setMobileServices } = useContext(WizardDispatchContext)

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='flex flex-col gap-y-6'>
        <hr className='border-b border-4 border-dial-blue-chalk' />
        <div className='text-sm pt-3 pb-12'>
          <div className='flex flex-wrap w-full gap-y-4'>
            <div className='lg:order-1 lg:basis-1/3 lg:pr-6'>
              <div className='font-semibold'>What countries will this project be implemented in?</div>
            </div>
            <div className='lg:order-4 lg:basis-1/3 w-full lg:pr-6'>
              <div className='flex flex-col gap-y-4'>
                <CountryAutocomplete countries={countries} setCountries={setCountries} />
                <div className='flex flex-col gap-y-1'>
                  <CountryActiveFilters countries={countries} setCountries={setCountries} />
                </div>
              </div>
            </div>
            <div className='lg:order-2 lg:basis-1/3 lg:px-3'>
              <div className='font-semibold'>Select any tags that are applicable to this project</div>
            </div>
            <div className='lg:order-5 lg:basis-1/3 w-full lg:px-3'>
              <div className='flex flex-col gap-y-4'>
                <TagAutocomplete tags={tags} setTags={setTags} />
                <div className='flex flex-col gap-y-1'>
                  <TagActiveFilters tags={tags} setTags={setTags} />
                </div>
              </div>
            </div>
            <div className='lg:order-3 lg:basis-1/3 lg:pl-6'>
              <div className='font-semibold'>Will mobile services be required for this project?</div>
            </div>
            <div className='lg:order-6 lg:basis-1/3 w-full lg:pl-6'>
              <div className='flex flex-col gap-y-4'>
                <MobileServiceAutocomplete mobileServices={mobileServices} setMobileServices={setMobileServices} />
                <div className='flex flex-col gap-y-1'>
                  <MobileServiceActiveFilters mobileServices={mobileServices} setMobileServices={setMobileServices} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WizardRefineContent

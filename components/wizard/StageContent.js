import { useIntl, FormattedMessage } from 'react-intl'
import Select from 'react-select'

import Phases from './Phases'

const Checkbox = props => (
  <input type="checkbox" {...props} />
)

export const WizardStage1 = ({ setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <Phases currPhase='' setAllValues={setAllValues} />
  )
}

export const WizardStage2 = ({ projData, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <div className='flex'>
      <div className='w-1/4 px-5'>
        <div className='text-sm pt-6 pb-2'>
          {format('wizard.selectSector')}
        </div>
        <Select className='text-button-gray' options={projData.sectors} 
          onChange={(val) => setAllValues( prevValues => {return { ...prevValues, sector: val.value}})} 
          placeholder={format('wizard.sectorPlaceholder')} 
        />
      </div>
      <div className='w-1/4 px-5'>
        <div className='text-sm pt-1 pb-2'>
          {format('wizard.selectUseCase')}
        </div>
        <Select className='text-button-gray' options={projData.useCases} 
          onChange={(val) => setAllValues( prevValues => {return { ...prevValues, useCase: val.value}})}  
          placeholder={format('wizard.useCasePlaceholder')} 
        />
      </div>
      <div className='w-1/4 px-5'>
        <div className='text-sm pt-1 pb-2'>
          {format('wizard.selectCountry')}
        </div>
        <Select className='text-button-gray' options={projData.countries} 
          onChange={(val) => setAllValues( prevValues => {return { ...prevValues, country: val.value}})}  
          placeholder={format('wizard.countryPlaceholder')} 
        />
      </div>
    </div>
  )
}

export const WizardStage3 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <div className='flex'>
      <div className='w-1/4 px-5 mx-5'>
        <div className='text-sm pt-6 pb-2'>
          {format('wizard.selectTags')}
        </div>
        <Select className='text-button-gray pb-2' options={projData.tags} 
          onChange={(val) => allValues.tags.push(val.value) && setAllValues( prevValues => {return { ...prevValues, tags: allValues.tags}})} 
          placeholder={format('wizard.tagPlaceholder')} 
        />
        { allValues.tags.map((tag) => {
          return (<div className='text-button-gray-light w-1/2 flex justify-between bg-button-gray pl-2 p-1 rounded m-1' key={tag}>{tag}<div className='text-white' onClick={() => {
            setAllValues( prevValues => { return { ...prevValues, tags: allValues.tags.filter(val => val !== tag)}})
          }}>
            <img src='/icons/CloseIcon.svg' className='inline mr-2' alt='Back' height='10px' width='10px' />
            </div></div>)
        })}
      </div>
      <div className='w-1/3 px-5 mx-5'>
        <div className='text-sm pt-6 pb-2'>
          {format('wizard.selectMobile')}
        </div>
        <div className='grid grid-cols-2'>
          {projData.mobileServices.map((service) => { 
            return (
              <div key={service.value} className='text-sm pt-1'>
                <div>
                  <Checkbox className='form-checkbox bg-dial-gray-dark border rounded text-white color-dial-gray-dark' 
                    onChange={(e) => e.currentTarget.checked ? 
                      allValues.mobileServices.push(service.value) && 
                      setAllValues( prevValues => { return { ...prevValues, mobileServices: allValues.mobileServices}})
                    : 
                      setAllValues( prevValues => { return { ...prevValues, mobileServices: allValues.mobileServices.filter(val => val !== service.value)}})
                    }
                  />
                  <span className='pl-2'>
                    {service.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const WizardStage4 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const classNameSelected = 'bg-white border border-white rounded px-6 py-4 my-2 mr-4 text-button-gray inline'
  const classNameNotSelected = 'bg-dial-gray-dark border border-white rounded px-6 py-4 my-2 mr-4 text-white inline'
  return (
    <div className='flex'>
      <div className='w-1/4 px-5 mx-5'>
        <div className='text-sm pt-6 pb-2'>
          {format('wizard.buildingBlocks')}
        </div>
      </div>
      <div className='w-2/3 px-5 mx-5'>
        <div className='text-sm pt-2 pb-2'>
          {projData.buildingBlocks.map((bb) => { 
            return (
              <div key={bb} className='flex flex-row items-center'>
                <button onClick={() => { allValues.buildingBlocks.push(bb) && 
                      setAllValues( prevValues => { return { ...prevValues, buildingBlocks: allValues.buildingBlocks}})}} 
                  className={allValues.buildingBlocks.includes(bb) ? classNameSelected : classNameNotSelected}>
                  {format('wizard.yes')}
                </button>
                <button onClick={() => { setAllValues( prevValues => { return { ...prevValues, buildingBlocks: allValues.buildingBlocks.filter(val => val !== bb)}})}} 
                  className={allValues.buildingBlocks.includes(bb) ? classNameNotSelected : classNameSelected}>
                  {format('wizard.no')}
                </button>
                <div className='inline-block'>
                  {bb.toUpperCase()}
                  <br />
                  {format('wizard.bb.'+bb.replace(/\s+/g, "").toLowerCase())}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}



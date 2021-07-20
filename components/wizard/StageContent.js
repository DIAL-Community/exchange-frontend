import { useIntl } from 'react-intl'
import Select from 'react-select'
import { useState } from 'react'

const Checkbox = props => (
  <input type='checkbox' {...props} />
)

export const WizardStage1 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [subSectors, setSubsectors] = useState()

  const updateSubsectors = (val) => {
    const currSector = projData.sectors.find(sector => sector.value === val.value)
    setSubsectors(currSector.subSectors.map((sector) => { return { label: sector.name.split(':')[1], value: sector.name.split(':')[1] } }))
    setAllValues(prevValues => { return { ...prevValues, sector: val.value } })
  }

  return (
    <div className='lg:flex'>
      <div className='lg:w-1/4 lg:px-5'>
        <div className='text-sm pb-2 h-12 grid content-end'>
          <div>{format('wizard.selectSector')}</div>
        </div>
        <Select
          className='text-button-gray' options={projData.sectors}
          value={allValues.sector && { value: allValues.sector, label: allValues.sector }}
          onChange={(val) => updateSubsectors(val)}
          placeholder={format('wizard.sectorPlaceholder')}
        />
      </div>
      <div className='lg:w-1/4 lg:px-5'>
        <div className='text-sm pb-2 h-12 grid content-end'>
          {format('wizard.selectSubsector')}
        </div>
        <Select
          className='text-button-gray' options={subSectors}
          value={allValues.subsector && { value: allValues.subsector, label: allValues.subsector }}
          onChange={(val) => setAllValues(prevValues => { return { ...prevValues, subsector: val.value } })}
          placeholder={format('wizard.subsectorPlaceholder')}
        />
      </div>
      <div className='lg:w-1/4 lg:px-5'>
        <div className='text-sm pb-2 h-12 grid content-end'>
          {format('wizard.selectSDG')}
        </div>
        <Select
          className='text-button-gray' options={projData.sdgs}
          value={allValues.sdg && { value: allValues.sdg, label: allValues.sdg }}
          onChange={(val) => setAllValues(prevValues => { return { ...prevValues, sdg: val.value } })}
          placeholder={format('wizard.sdgPlaceholder')}
        />
      </div>
    </div>
  )
}

export const WizardStage2 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <div className='lg:flex'>
      <div className='lg:w-1/4 lg:px-5 lg:mx-5'>
        <div className='text-sm h-12 pt-6 pb-2'>
          {format('wizard.selectTags')}
        </div>
        <Select
          className='text-button-gray pb-2' options={projData.tags}
          onChange={(val) => allValues.tags.push(val.value) && setAllValues(prevValues => { return { ...prevValues, tags: allValues.tags } })}
          placeholder={format('wizard.tagPlaceholder')}
        />
        {allValues.tags.map((tag) => {
          return (
            <div className='text-button-gray-light w-1/2 flex justify-between bg-button-gray pl-2 p-1 rounded m-1' key={tag}>{tag}
              <div
                className='text-white' onClick={() => {
                  setAllValues(prevValues => { return { ...prevValues, tags: allValues.tags.filter(val => val !== tag) } })
                }}
              >
                <img src='/icons/close.svg' className='inline mr-2' alt='Back' height='10px' width='10px' />
              </div>
            </div>
          )
        })}
      </div>
      <div className='lg:w-1/4 lg:px-5'>
        <div className='text-sm pb-2 h-12 grid content-end'>
          {format('wizard.selectCountry')}
        </div>
        <Select
          className='text-button-gray' options={projData.countries}
          value={allValues.country && { value: allValues.country, label: allValues.country }}
          onChange={(val) => setAllValues(prevValues => { return { ...prevValues, country: val.value } })}
          placeholder={format('wizard.countryPlaceholder')}
        />
      </div>
      <div className='lg:w-1/3 lg:px-5 lg:mx-5'>
        <div className='text-sm pb-2'>
          {format('wizard.selectMobile')}
        </div>
        <div className='lg:grid lg:grid-cols-2'>
          {projData.mobileServices.map((service) => {
            return (
              <div key={service.value} className='text-sm pt-1'>
                <div>
                  <Checkbox
                    className='form-checkbox bg-dial-gray-dark border rounded text-white color-dial-gray-dark'
                    onChange={(e) => e.currentTarget.checked
                      ? allValues.mobileServices.push(service.value) &&
                        setAllValues(prevValues => { return { ...prevValues, mobileServices: allValues.mobileServices } })
                      : setAllValues(prevValues => { return { ...prevValues, mobileServices: allValues.mobileServices.filter(val => val !== service.value) } })}
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

export const WizardStage3 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const classNameSelected = 'bg-white border border-white rounded px-4 lg:px-6 py-4 my-2 mr-4 text-button-gray inline'
  const classNameNotSelected = 'bg-dial-gray-dark border border-white rounded px-4 lg:px-6 py-4 my-2 mr-4 text-white inline'
  return (
    <div className='lg:flex'>
      <div className='lg:w-1/4 lg:px-5 lg:mx-5'>
        <div className='text-sm pt-6 pb-2'>
          {format('wizard.buildingBlocks')}
        </div>
      </div>
      <div className='lg:w-2/3 lg:px-5 lg:mx-5'>
        <div className='text-sm pt-2 pb-2 overflow-y-scroll bb-content'>
          {projData.buildingBlocks.map((bb) => {
            return (
              <div key={bb} className='flex flex-row items-center'>
                <button
                  onClick={() => {
                    allValues.buildingBlocks.push(bb) &&
                    setAllValues(prevValues => { return { ...prevValues, buildingBlocks: allValues.buildingBlocks } })
                  }}
                  className={allValues.buildingBlocks.includes(bb) ? classNameSelected : classNameNotSelected}
                >
                  {format('wizard.yes')}
                </button>
                <button
                  onClick={() => { setAllValues(prevValues => { return { ...prevValues, buildingBlocks: allValues.buildingBlocks.filter(val => val !== bb) } }) }}
                  className={allValues.buildingBlocks.includes(bb) ? classNameNotSelected : classNameSelected}
                >
                  {format('wizard.no')}
                </button>
                <div className='inline-block my-2'>
                  {bb.toUpperCase()}
                  <br />
                  {format('wizard.bb.' + bb.replace(/\s+/g, '').toLowerCase())}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

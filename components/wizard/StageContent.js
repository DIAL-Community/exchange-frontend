import { useIntl } from 'react-intl'
import Select from 'react-select'
import { useState } from 'react'

const Checkbox = props => (
  <input type='checkbox' {...props} />
)

export const WizardStage1 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [subSectors, setSubsectors] = useState()

  const updateSubsectors = (val) => {
    const currSector = projData.sectors.find(sector => sector.value === val.value)
    setSubsectors(currSector.subSectors.map((sector) => { return { label: sector.name.split(':')[1], value: sector.name.split(':')[1] } }))
    setAllValues(prevValues => { return { ...prevValues, sector: val.value } })
  }

  return (
    <div className='lg:flex gap-12'>
      <div className='lg:w-1/4 lg:mt-auto'>
        <div className='text-sm my-2 grid content-end'>
          <div>{format('wizard.selectSector')}</div>
        </div>
        <Select
          className='text-button-gray' options={projData.sectors}
          value={allValues.sector && { value: allValues.sector, label: allValues.sector }}
          onChange={(val) => updateSubsectors(val)}
          placeholder={format('wizard.sectorPlaceholder')}
        />
      </div>
      <div className='lg:w-1/4 mt-6 lg:mt-auto'>
        <div className='text-sm my-2 grid content-end'>
          {format('wizard.selectSubsector')}
        </div>
        <Select
          className='text-button-gray' options={subSectors}
          value={allValues.subsector && { value: allValues.subsector, label: allValues.subsector }}
          onChange={(val) => setAllValues(prevValues => { return { ...prevValues, subsector: val && val.value } })}
          placeholder={format('wizard.subsectorPlaceholder')}
          isClearable
        />
      </div>
      <div className='lg:w-1/4 mt-6 lg:mt-auto'>
        <div className='text-sm my-2 grid content-end'>
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
  const format = (id, values) => formatMessage({ id: id }, values)

  const addSelectedTagValue = (selectedTagValue) => {
    if (allValues.tags.indexOf(selectedTagValue) < 0) {
      allValues.tags.push(selectedTagValue)
      setAllValues(prevValues => { return { ...prevValues, tags: allValues.tags } })
    }
  }

  const addSelectedCountryName = (selectedCountryName) => {
    if (allValues.countries.indexOf(selectedCountryName) < 0) {
      allValues.countries.push(selectedCountryName)
      setAllValues(prevValues => { return { ...prevValues, countries: allValues.countries } })
    }
  }

  return (
    <div className='lg:grid lg:grid-cols-3 gap-12 '>
      <div className='mt-6 lg:mt-0'>
        <div className='text-sm pb-2'>
          {format('wizard.selectTags')}
        </div>
        <Select
          className='text-button-gray pb-2' options={projData.tags}
          onChange={(tag) => addSelectedTagValue(tag.value)}
          placeholder={format('wizard.tagPlaceholder')}
        />
        <div className=''>
          {allValues.tags.map((tag) => {
            return (
              <div className='text-button-gray-light flex justify-between bg-button-gray pl-2 p-1 rounded my-1' key={tag}>{tag}
                <div
                  className='text-white' onClick={() => {
                    setAllValues(prevValues => { return { ...prevValues, tags: allValues.tags.filter(val => val !== tag) } })
                  }}
                >
                  <img src='/icons/close.svg' className='cursor-pointer inline mr-2' alt='Back' height='10px' width='10px' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='mt-6 lg:mt-0'>
        <div className='text-sm pb-2'>
          {format('wizard.selectCountry')}
        </div>
        <Select
          className='text-button-gray pb-2' options={projData.countries}
          onChange={(country) => addSelectedCountryName(country.value)}
          placeholder={format('wizard.countryPlaceholder')}
        />
        <div className=''>
          {allValues.countries.map((country) => {
            return (
              <div className='text-button-gray-light flex justify-between bg-button-gray pl-2 p-1 rounded my-1' key={country}>{country}
                <div
                  className='text-white' onClick={() => {
                    setAllValues(prevValues => { return { ...prevValues, countries: allValues.countries.filter(val => val !== country) } })
                  }}
                >
                  <img src='/icons/close.svg' className='cursor-pointer inline mr-2' alt='Back' height='10px' width='10px' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='mt-6 lg:mt-0'>
        <div className='text-sm pb-2'>
          {format('wizard.selectMobile')}
        </div>
        <div className='xl:grid xl:grid-cols-2'>
          {projData.mobileServices.map((service) => {
            return (
              <div key={service.value} className='text-sm pt-2'>
                <label>
                  <Checkbox
                    className='h-5 w-5 form-checkbox bg-dial-gray-dark border rounded text-white color-dial-gray-dark'
                    onChange={(e) => e.currentTarget.checked
                      ? allValues.mobileServices.push(service.value) &&
                        setAllValues(prevValues => { return { ...prevValues, mobileServices: allValues.mobileServices } })
                      : setAllValues(prevValues => { return { ...prevValues, mobileServices: allValues.mobileServices.filter(val => val !== service.value) } })}
                  />
                  <span className='pl-2'>
                    {service.label}
                  </span>
                </label>
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
  const format = (id, values) => formatMessage({ id: id }, values)
  const classNameSelected = 'bg-white border border-white rounded px-4 lg:px-6 py-4 my-2 mr-4 text-button-gray inline'
  const classNameNotSelected = 'bg-dial-gray-dark border border-white rounded px-4 lg:px-6 py-4 my-2 mr-4 text-white inline'

  return (
    <div className='lg:flex gap-12 -mb-12'>
      <div className='lg:w-1/4'>
        <div className='text-sm pt-6 pb-2'>
          {format('wizard.buildingBlocks')}
        </div>
      </div>
      <div className='lg:w-2/3'>
        <div className='text-sm pt-2 pb-2 bb-content overflow-y-auto'>
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

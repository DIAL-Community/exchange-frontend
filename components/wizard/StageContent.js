import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import Select from '../shared/Select'
import Pill from '../shared/Pill'
import Checkbox from '../shared/Checkbox'
import { WIZARD_USE_CASES_FOR_SECTOR } from '../../queries/wizard'

export const WizardStage1 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data } = useQuery(WIZARD_USE_CASES_FOR_SECTOR, { variables: { sectorSlug: allValues.sectorSlug } })

  return (
    <div className='lg:flex gap-12'>
      <div className='lg:w-1/4 lg:mt-auto'>
        <div className='text-sm my-2 grid content-end'>
          <div>{format('wizard.selectSector')}</div>
        </div>
        <Select
          options={projData.sectors}
          value={allValues.sector && { value: allValues.sector, label: allValues.sector }}
          onChange={(sector) =>  setAllValues(prevValues => ({ ...prevValues, sector: sector.value, sectorSlug: sector.slug, useCase: '' }))}
          placeholder={format('wizard.sectorPlaceholder')}
        />
      </div>
      <div className='lg:w-1/4 mt-6 lg:mt-auto'>
        <div className='text-sm my-2 grid content-end'>
          {format('wizard.selectUseCase')}
        </div>
        <Select
          options={data?.useCasesForSector?.map((useCase) => ({ label: useCase.name }))}
          value={allValues.useCase && { label: allValues.useCase }}
          onChange={(useCase) => setAllValues(prevValues => ({ ...prevValues, useCase: useCase?.label ?? '' }))}
          placeholder={format('wizard.useCasePlaceholder')}
          isClearable
        />
      </div>
      <div className='lg:w-1/4 mt-6 lg:mt-auto'>
        <div className='text-sm my-2 grid content-end'>
          {format('wizard.selectSDG')}
        </div>
        <Select
          options={projData.sdgs}
          value={allValues.sdg && { value: allValues.sdg, label: allValues.sdg }}
          onChange={(val) => setAllValues(prevValues => ({ ...prevValues, sdg: val.value }))}
          placeholder={format('wizard.sdgPlaceholder')}
        />
      </div>
    </div>
  )
}

export const WizardStage2 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  const removeTag = (tagValue) => {
    setAllValues(prevValues => { return { ...prevValues, tags: allValues.tags.filter(val => val !== tagValue) } })
  }

  const removeCountry = (countryValue) => {
    setAllValues(prevValues => { return { ...prevValues, countries: allValues.countries.filter(val => val !== countryValue) } })
  }

  return (
    <div className='lg:grid lg:grid-cols-3 gap-12 '>
      <div className='mt-6 lg:mt-0'>
        <div className='text-sm pb-2'>
          {format('wizard.selectTags')}
        </div>
        <Select
          options={projData.tags}
          onChange={(tag) => addSelectedTagValue(tag.value)}
          placeholder={format('wizard.tagPlaceholder')}
          value={null}
        />
        <div className='flex flex-wrap gap-3 mt-5'>
          {allValues.tags.map((tag, tagIdx) => (
            <Pill
              key={`tag-${tagIdx}`}
              label={tag}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      </div>
      <div className='mt-6 lg:mt-0'>
        <div className='text-sm pb-2'>
          {format('wizard.selectCountry')}
        </div>
        <Select
          options={projData.countries}
          onChange={(country) => addSelectedCountryName(country.value)}
          placeholder={format('wizard.countryPlaceholder')}
          value={null}
        />
        <div className='flex flex-wrap gap-3 mt-5'>
          {allValues.countries.map((country, countryIdx) => (
            <Pill
              key={`country-${countryIdx}`}
              label={country}
              onRemove={() => removeCountry(country)}
            />
          ))}
        </div>
      </div>
      <div className='mt-6 lg:mt-0'>
        <div className='text-sm pb-2'>
          {format('wizard.selectMobile')}
        </div>
        <div className='xl:grid xl:grid-cols-2'>
          {projData.mobileServices.map((service, serviceIdx) => (
            <div key={serviceIdx} className='text-sm pt-2'>
              <label>
                <Checkbox
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
          ))}
        </div>
      </div>
    </div>
  )
}

export const WizardStage3 = ({ projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
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

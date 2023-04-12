import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Select from '../shared/Select'
import Pill from '../shared/Pill'
import Checkbox from '../shared/Checkbox'

export const WizardStage1 = ({ wizardData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const addSector = (sector) =>
    setAllValues(prevValues => ({
      ...prevValues,
      sectors: [...allValues.sectors.filter(({ slug }) => slug !== sector.slug), sector]
    }))

  const removeSector = (sector) =>
    setAllValues(prevValues => ({
      ...prevValues,
      sectors: allValues.sectors.filter(value => value !== sector)
    }))

  const addSdg = (sdg) =>
    setAllValues(prevValues => ({
      ...prevValues,
      sdgs: [...allValues.sdgs.filter(({ slug }) => slug !== sdg.slug), sdg]
    }))

  const removeSdg = (sdg) =>
    setAllValues(prevValues => ({
      ...prevValues,
      sdgs: allValues.sdgs.filter(value => value !== sdg)
    }))

  return (
    <div className='grid xl:grid-cols-3 gap-x-12 gap-y-3'>
      <div className='flex flex-col gap-3 order-1'>
        <div className='text-sm'>
          <div>{format('wizard.selectSector')}</div>
        </div>
        <Select
          className='mt-auto'
          options={wizardData.sectors}
          value={null}
          onChange={(sector) => addSector(sector)}
          placeholder={format('wizard.sectorPlaceholder')}
        />
      </div>
      <div className='flex flex-col gap-3 order-3 xl:order-2'>
        <div className='text-sm'>
          {format('wizard.selectUseCase')}
        </div>
        <Select
          className='mt-auto'
          options={wizardData.useCases}
          value={
            allValues.useCase &&
            { value: allValues.useCase, label: allValues.useCase }
          }
          onChange={(useCase) =>
            setAllValues(prevValues =>
              ({ ...prevValues, useCase: useCase?.label ?? '' }))
          }
          placeholder={format('wizard.useCasePlaceholder')}
          isClearable
        />
      </div>
      <div className='flex flex-col gap-3 order-5 xl:order-3'>
        <div className='text-sm'>
          {format('wizard.selectSDG')}
        </div>
        <Select
          options={wizardData.sdgs}
          value={null}
          onChange={(sdg) => addSdg(sdg)}
          placeholder={format('wizard.sdgPlaceholder')}
        />
      </div>
      <div className='pill-container order-2 xl:order-4'>
        <div className='flex flex-wrap gap-3'>
          {allValues.sectors?.map((sector, sectorIdx) => (
            <Pill
              key={`sector-${sectorIdx}`}
              label={sector.label}
              onRemove={() => removeSector(sector)}
            />
          ))}
        </div>
      </div>
      <div className='order-4 xl:order-5'/>
      <div className='pill-container order-6'>
        <div className='flex flex-wrap gap-3'>
          {allValues.sdgs?.map((sdg, sdgIdx) => (
            <Pill
              key={`sdg-${sdgIdx}`}
              label={sdg.label}
              onRemove={() => removeSdg(sdg)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const WizardStage2 = ({ wizardData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const addSelectedTagValue = (selectedTagValue) => {
    if (allValues.tags.indexOf(selectedTagValue) < 0) {
      allValues.tags.push(selectedTagValue)
      setAllValues(prevValues => ({
        ...prevValues,
        tags: allValues.tags
      }))
    }
  }

  const addSelectedCountryName = (selectedCountryName) => {
    if (allValues.countries.indexOf(selectedCountryName) < 0) {
      allValues.countries.push(selectedCountryName)
      setAllValues(prevValues => ({
        ...prevValues,
        countries: allValues.countries
      }))
    }
  }

  const removeTag = (tagValue) => {
    setAllValues(prevValues => ({
      ...prevValues,
      tags: allValues.tags.filter(val => val !== tagValue)
    }))
  }

  const removeCountry = (countryValue) => {
    setAllValues(prevValues => ({
      ...prevValues,
      countries: allValues.countries.filter(val => val !== countryValue)
    }))
  }

  return (
    <div className='flex flex-col lg:flex-row gap-x-12 gap-y-3'>
      <div className='lg:w-1/3'>
        <div className='text-sm my-2'>
          {format('wizard.selectTags')}
        </div>
        <Select
          options={wizardData.tags}
          onChange={(tag) => addSelectedTagValue(tag.value)}
          placeholder={format('wizard.tagPlaceholder')}
          value={null}
        />
        <div className='flex flex-wrap gap-3 mt-4'>
          {allValues.tags.map((tag, tagIdx) => (
            <Pill
              key={`tag-${tagIdx}`}
              label={tag}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      </div>
      <div className='lg:w-1/3'>
        <div className='text-sm my-2'>
          {format('wizard.selectCountry')}
        </div>
        <Select
          options={wizardData.countries}
          onChange={(country) => addSelectedCountryName(country.value)}
          placeholder={format('wizard.countryPlaceholder')}
          value={null}
        />
        <div className='flex flex-wrap gap-3 mt-4'>
          {allValues.countries.map((country, countryIdx) => (
            <Pill
              key={`country-${countryIdx}`}
              label={country}
              onRemove={() => removeCountry(country)}
            />
          ))}
        </div>
      </div>
      <div className='lg:w-1/3'>
        <div className='text-sm my-2'>
          {format('wizard.selectMobile')}
        </div>
        <div className='grid xl:grid-cols-2 gap-2'>
          {wizardData.mobileServices.map((service, serviceIdx) => (
            <div key={serviceIdx} className='text-sm'>
              <label>
                <Checkbox
                  onChange={(e) => e.currentTarget.checked
                    ? allValues.mobileServices.push(service.value) &&
                        setAllValues(prevValues => ({
                          ...prevValues,
                          mobileServices: allValues.mobileServices
                        }))
                    : setAllValues(prevValues => ({
                      ...prevValues,
                      mobileServices: allValues.mobileServices.filter(val => val !== service.value)
                    }))
                  }
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

export const WizardStage3 = ({ wizardData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const classNameSelected = 'border border-dial-stratos bg-dial-stratos text-white rounded p-4'
  const classNameNotSelected = 'border border-dial-stratos text-dial-stratos rounded p-4 '

  return (
    <div className='flex flex-col lg:flex-row gap-x-12 gap-y-3'>
      <div className='lg:w-1/3'>
        <div className='text-sm'>
          {format('wizard.buildingBlocks')}
        </div>
      </div>
      <div className='lg:w-2/3'>
        <div className='text-sm bb-content overflow-y-auto flex flex-col gap-4'>
          {wizardData.buildingBlocks.map((bb) => {
            return (
              <div key={bb.id} className='flex flex-row gap-4 items-center'>
                <button
                  onClick={() => {
                    allValues.buildingBlocks.push(bb.name) &&
                    setAllValues(prevValues => ({
                      ...prevValues,
                      buildingBlocks: allValues.buildingBlocks
                    }))
                  }}
                  className={allValues.buildingBlocks.includes(bb.name)
                    ? classNameSelected
                    : classNameNotSelected
                  }
                >
                  {format('wizard.yes')}
                </button>
                <button
                  onClick={() => setAllValues(
                    prevValues => ({
                      ...prevValues,
                      buildingBlocks: allValues.buildingBlocks.filter(val => val !== bb.name)
                    })
                  )}
                  className={allValues.buildingBlocks.includes(bb.name)
                    ? classNameNotSelected
                    : classNameSelected
                  }
                >
                  {format('wizard.no')}
                </button>
                <div className='inline-block my-2'>
                  {bb.name.toUpperCase()}
                  <span className='ml-1 capitalize'>({bb.maturity.toLowerCase()})</span>
                  <br />
                  {format('wizard.bb.' + bb.name.replace(/\s+/g, '').toLowerCase())}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { CountryActiveFilters, CountryAutocomplete } from '../../shared/filter/Country'
import { DatasetTypeActiveFilters, DatasetTypeSelect } from '../../shared/filter/DatasetType'
import { OriginActiveFilters, OriginAutocomplete } from '../../shared/filter/Origin'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'

const DatasetFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    countries,
    datasetTypes,
    origins,
    sdgs,
    sectors,
    tags
  } = useContext(FilterContext)

  const {
    setCountries,
    setDatasetTypes,
    setOrigins,
    setSdgs,
    setSectors,
    setTags
  } = useContext(FilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setSectors([])
    setDatasetTypes([])

    setTags([])
    setSdgs([])
    setOrigins([])
    setCountries([])
  }

  const filteringDataset = () => {
    return sectors.length +
      sectors.length +
      datasetTypes.length +
      tags.length +
      sdgs.length +
      origins.length +
      countries.length > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringDataset() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button type='button' onClick={clearFilter}>
                <span className='text-dial-sapphire'>
                  {format('ui.filter.clearAll')}
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <OriginActiveFilters origins={origins} setOrigins={setOrigins} />
            <DatasetTypeActiveFilters datasetTypes={datasetTypes} setDatasetTypes={setDatasetTypes} />
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
            <CountryActiveFilters countries={countries} setCountries={setCountries} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200' />
        <OriginAutocomplete origins={origins} setOrigins={setOrigins} />
        <hr className='border-b border-dial-slate-200' />
        <DatasetTypeSelect datasetTypes={datasetTypes} setDatasetTypes={setDatasetTypes} />
        <hr className='border-b border-dial-slate-200' />
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
        <hr className='border-b border-dial-slate-200' />
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200' />
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='border-b border-dial-slate-200' />
        <CountryAutocomplete countries={countries} setCountries={setCountries} />
      </div>
    </div>
  )
}

export default DatasetFilter

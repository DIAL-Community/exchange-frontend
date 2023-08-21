import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { DatasetFilterContext, DatasetFilterDispatchContext }
  from '../../../../components/context/DatasetFilterContext'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { OriginActiveFilters, OriginAutocomplete } from '../../shared/filter/Origin'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { DatasetTypeActiveFilters, DatasetTypeSelect } from '../../shared/filter/DatasetType'

const DatasetFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sectors, tags, sdgs, origins, datasetTypes } = useContext(DatasetFilterContext)
  const { setSectors, setTags, setSdgs, setOrigins, setDatasetTypes } = useContext(DatasetFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setSectors([])
    setDatasetTypes([])

    setTags([])
    setSdgs([])
    setOrigins([])
  }

  const filteringDataset = () => {
    return sectors.length +
      sectors.length +
      datasetTypes.length +
      tags.length +
      sdgs.length +
      origins.length > 0
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
                {format('ui.filter.clearAll')}
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <OriginActiveFilters origins={origins} setOrigins={setOrigins} />
            <DatasetTypeActiveFilters datasetTypes={datasetTypes} setDatasetTypes={setDatasetTypes} />
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <OriginAutocomplete origins={origins} setOrigins={setOrigins} />
        <hr className='border-b border-dial-slate-200'/>
        <DatasetTypeSelect datasetTypes={datasetTypes} setDatasetTypes={setDatasetTypes} />
        <hr className='border-b border-dial-slate-200'/>
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
        <hr className='border-b border-dial-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default DatasetFilter

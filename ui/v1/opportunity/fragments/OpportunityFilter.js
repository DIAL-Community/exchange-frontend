import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6'
import {
  OpportunityFilterContext,
  OpportunityFilterDispatchContext
} from '../../../../components/context/OpportunityFilterContext'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import Checkbox from '../../shared/form/Checkbox'

const COVID_19_LABEL = 'COVID-19'

const OpportunityFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sectors, tags } = useContext(OpportunityFilterContext)
  const { setSectors, setTags } = useContext(OpportunityFilterDispatchContext)

  const [expanded, setExpanded] = useState(false)

  const isCovid19TagActive = tags.some(({ slug }) => slug === COVID_19_LABEL)

  const toggleCovid19Tag = () => {
    const tagsWithoutCovid19 = tags.filter(({ slug }) => slug !== COVID_19_LABEL)
    setTags(isCovid19TagActive
      ? tagsWithoutCovid19
      : [
        ...tagsWithoutCovid19,
        { label: COVID_19_LABEL, value: COVID_19_LABEL, slug: COVID_19_LABEL }
      ]
    )
  }

  const clearFilter = (e) => {
    e.preventDefault()

    setSectors([])
    setTags([])
  }

  const filteringOpportunity = () => {

    return sectors.length +
      tags.length > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringOpportunity() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button onClick={clearFilter}>
                {format('ui.filter.clearAll')}
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='bg-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='bg-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          <button className='w-full' onClick={() => setExpanded(!expanded)}>
            <div className='flex w-full gap-3'>
              <div className='my-auto'>
                {format('ui.filter.additional.title')}
              </div>
              <div className='ml-auto py-2 text-xl'>
                {expanded ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            </div>
          </button>
        </div>
        {expanded &&
          <>
            <label className='flex pl-4 py-2'>
              <Checkbox value={isCovid19TagActive} onChange={toggleCovid19Tag} />
              <span className='mx-2 my-auto text-sm'>
                {format('filter.opportunity.forCovid')}
              </span>
            </label>
            <hr className='bg-slate-200'/>
          </>
        }
      </div>
    </div>
  )
}

export default OpportunityFilter
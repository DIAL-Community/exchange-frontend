import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { DatasetFilterContext, DatasetFilterDispatchContext }
  from '../context/DatasetFilterContext'
import { CountryAutocomplete } from '../filter/element/Country'
import { OrganizationAutocomplete } from '../filter/element/Organization'
import { OriginAutocomplete } from '../filter/element/Origin'
import { DatasetTypeSelect } from '../filter/element/DatasetType'
import { SDGAutocomplete } from '../filter/element/SDG'
import { SectorAutocomplete } from '../filter/element/Sector'
import { TagAutocomplete } from '../filter/element/Tag'

const DatasetFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setHintDisplayed } = useContext(FilterContext)

  const {
    sectors, countries, organizations, origins, sdgs, tags, datasetTypes
  } = useContext(DatasetFilterContext)

  const {
    setSectors, setCountries, setOrganizations, setOrigins, setSDGs, setTags, setDatasetTypes
  } = useContext(DatasetFilterDispatchContext)

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-base'>
          <a
            className={`
              cursor-pointer font-semibold gap-1 hover:underline
              decoration-2 decoration-dial-yellow
            `}
            onClick={() => setHintDisplayed(true)}
          >
            <span className='mr-1'>{format('filter.hint.text')} {format('dataset.label')}</span>
            <BsQuestionCircleFill className='inline text-xl mb-1 fill-dial-yellow' />
          </a>
        </div>
        <div className='text-sm flex flex-row'>
          <div className='text-xl px-2 pb-3'>
            {format('filter.framework.title').toUpperCase()}
          </div>
        </div>
        <div className='text-sm flex flex-row'>
          <div className='pl-2 pr-4 pb-2'>
            {format('filter.framework.subTitle', { entity: format('dataset.header') })}
          </div>
        </div>
        <div className='text-sm flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
        <div className='col-span-11 lg:col-span-6'>
          <div className='text-xl px-2 pb-3 pt-2'>
            {format('filter.entity', { entity: format('dataset.label') }).toUpperCase()}
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <OriginAutocomplete
              {...{ origins, setOrigins }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <DatasetTypeSelect
              {...{ datasetTypes, setDatasetTypes }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <CountryAutocomplete
              {...{ countries, setCountries }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <SectorAutocomplete
              {...{ sectors, setSectors }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <OrganizationAutocomplete
              {...{ organizations, setOrganizations }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetFilter

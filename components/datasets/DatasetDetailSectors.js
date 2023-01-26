import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_DATASET_SECTORS } from '../../mutations/dataset'
import { fetchSelectOptions } from '../../queries/utils'
import SectorCard from '../sectors/SectorCard'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { useUser } from '../../lib/hooks'

const DatasetDetailSectors = ({ dataset, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sectors, setSectors] = useState(dataset.sectors)
  const [isDirty, setIsDirty] = useState(false)

  const [updateDatasetSectors, { data, loading }] = useMutation(UPDATE_DATASET_SECTORS)

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateDatasetSectors?.errors.length === 0 && data?.updateDatasetSectors?.dataset) {
      setSectors(data.updateDatasetSectors.dataset.sectors)
      showToast(format('dataset.sectors.updated'), 'success', 'top-center')
      setIsDirty(false)
    }
  }, [data, showToast, format])

  const fetchedSectorsCallback = (data) => (
    data.sectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
      slug: sector.slug
    }))
  )

  const addSector = (sector) => {
    setSectors([...sectors.filter(({ slug }) => slug !== sector.slug), { name: sector.label, slug: sector.slug }])
    setIsDirty(true)
  }

  const removeSector = (sector) => {
    setSectors([...sectors.filter(({ slug }) => slug !== sector.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateDatasetSectors({
        variables: {
          slug: dataset.slug,
          sectorSlugs: sectors.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setSectors(data?.updateDatasetSectors?.dataset?.sectors ?? dataset.sectors)
    setIsDirty(false)
  }

  const displayModeBody = sectors.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {sectors.map((sector, sectorIdx) => <SectorCard key={sectorIdx} sector={sector} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('dataset.no-sector')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('sector.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='sector-search'>
        {`${format('app.searchAndAssign')} ${format('sector.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback, locale)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sector.header') })}
          onChange={addSector}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {sectors.map((sector, sectorIdx) => (
          <Pill
            key={`sector-${sectorIdx}`}
            label={sector.name}
            onRemove={() => removeSector(sector)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('sector.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default DatasetDetailSectors

import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_OPPORTUNITY_SECTORS } from '../../mutations/opportunity'
import { fetchSelectOptions } from '../../queries/utils'
import SectorCard from '../sectors/SectorCard'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { useUser } from '../../lib/hooks'

const OpportunityDetailSectors = ({ opportunity, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [isDirty, setIsDirty] = useState(false)
  const [sectors, setSectors] = useState(opportunity?.sectors)

  const [updateOpportunitySectors, { data, loading, reset }] = useMutation(
    UPDATE_OPPORTUNITY_SECTORS, {
      onError: () => {
        setIsDirty(false)
        setSectors(opportunity.sectors)
        showToast(format('toast.sectors.update.failure'), 'error', 'top-center')
        reset()
      },
      onCompleted: (data) => {
        const { updateOpportunitySectors: response } = data
        if (response?.opportunity && response?.errors?.length === 0) {
          setIsDirty(false)
          setSectors(data.updateOpportunitySectors.opportunity.sectors)
          showToast(format('toast.sectors.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setSectors(opportunity.sectors)
          showToast(format('toast.sectors.update.failure'), 'error', 'top-center')
          reset()
        }
      }
    }
  )

  const fetchedSectorsCallback = (data) => (
    data.sectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
      slug: sector.slug
    }))
  )

  const addSector = (sector) => {
    setSectors([
      ...sectors.filter(({ slug }) => slug !== sector.slug),
      { name: sector.label, slug: sector.slug }
    ])
    setIsDirty(true)
  }

  const removeSector = (sector) => {
    setSectors([...sectors.filter(({ slug }) => slug !== sector.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOpportunitySectors({
        variables: {
          slug: opportunity.slug,
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
    setSectors(data?.updateOpportunitySectors?.opportunity?.sectors ?? opportunity.sectors)
    setIsDirty(false)
  }

  const displayModeBody = sectors.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {sectors.map((sector, sectorIdx) =>
          <SectorCard key={sectorIdx} sector={sector} listType='list' />)
        }
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('opportunity.no-sector')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
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
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback, locale)
          }
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
    <div data-testid='opportunity-sectors'>
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
    </div>
  )
}

export default OpportunityDetailSectors

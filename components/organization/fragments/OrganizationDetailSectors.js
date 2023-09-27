import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { UPDATE_ORGANIZATION_SECTORS } from '../../shared/mutation/organization'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'

const OrganizationDetailSectors = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sectors, setSectors] = useState(organization.sectors)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationSectors, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_SECTORS, {
    onError() {
      setIsDirty(false)
      setSectors(organization?.sectors)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sector.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationSectors: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setSectors(response?.organization?.sectors)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.sector.header') }))
      } else {
        setIsDirty(false)
        setSectors(organization?.sectors)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sector.header') }))
        reset()
      }
    }
  })

  const fetchedSectorsCallback = (data) => (
    data.sectors?.map((sector) => ({
      id: sector.id,
      name: sector.name,
      slug: sector.slug,
      label: sector.name
    }))
  )

  const addSector = (sector) => {
    setSectors([
      ...[
        ...sectors.filter(({ id }) => id !== sector.id),
        { id: sector.id, name: sector.name, slug: sector.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeSector = (sector) => {
    setSectors([...sectors.filter(({ id }) => id !== sector.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOrganizationSectors({
        variables: {
          sectorSlugs: sectors.map(({ slug }) => slug),
          slug: organization.slug
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
    setSectors(organization.sectors)
    setIsDirty(false)
  }

  const displayModeBody = sectors.length
    ? <div className='flex flex-col gap-y-2'>
      {sectors?.map((sector, index) =>
        <div key={`sector-${index}`}>
          <div key={index}>{sector.name}</div>
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('general.na')}
    </div>

  const sectionHeader =
    <div className='font-semibold text-dial-sapphire'>
      {format('ui.sector.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.sector.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.sector.label') })}
          onChange={addSector}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {sectors.map((sector, sectorIdx) => (
          <Pill
            key={`sectors-${sectorIdx}`}
            label={sector.name}
            onRemove={() => removeSector(sector)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default OrganizationDetailSectors

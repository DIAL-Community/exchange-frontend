import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_PROJECT_SECTORS } from '../../mutations/project'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { fetchSelectOptions } from '../../queries/utils'
import SectorCard from '../sectors/SectorCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const ProjectDetailSectors = ({ project, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sectors, setSectors] = useState(project.sectors)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const [updateProjectSectors, { data, loading, reset }] = useMutation(UPDATE_PROJECT_SECTORS, {
    onCompleted: (data) => {
      const { updateProjectSectors: response } = data
      if (response?.project && response?.errors?.length === 0) {
        setIsDirty(false)
        setSectors(data.updateProjectSectors.project.sectors)
        showToast(format('toast.sectors.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setSectors(project.sectors)
        showToast(format('toast.sectors.update.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
    }
  })

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

      updateProjectSectors({
        variables: {
          slug: project.slug,
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
    setSectors(data?.updateProjectSectors?.project?.sectors ?? project.sectors)
    setIsDirty(false)
  }

  const displayModeBody = sectors.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {sectors.map((sector, sectorIdx) => <SectorCard key={sectorIdx} sector={sector} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('project.no-sector')}
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

export default ProjectDetailSectors

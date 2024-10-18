import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../../../lib/ToastContext'
import Pill from '../../../shared/form/Pill'
import EditableSection from '../../../shared/EditableSection'
import CityCard from '../../../city/CityCard'
import GeocodeAutocomplete from '../../../shared/form/GeocodeAutocomplete'
import { UPDATE_ORGANIZATION_OFFICES } from '../../../shared/mutation/organization'
import { useUser } from '../../../../lib/hooks'
import { DisplayType } from '../../../utils/constants'

const OFFICE_NAME_PARTS_SEPARATOR = ', '

const OrganizationDetailOffices = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const mapOfficeCallback = ({ name, cityData, country, region }) => ({
    name,
    slug: cityData?.slug,
    cityName: cityData?.name,
    regionName: region?.name,
    countryCode: country?.codeLonger
  })

  const [isDirty, setIsDirty] = useState(false)
  const [offices, setOffices] = useState(organization.offices?.map(mapOfficeCallback))

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationOffices, { loading }] = useMutation(UPDATE_ORGANIZATION_OFFICES, {
    onError: () => {
      setIsDirty(false)
      setOffices(organization.offices?.map(mapOfficeCallback))
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.office.header') }))
    },
    onCompleted: (data) => {
      const { updateOrganizationOffices: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setOffices(response?.organization?.offices?.map(mapOfficeCallback))
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.office.header') }))
        setIsDirty(false)
      } else {
        setIsDirty(false)
        setOffices(organization.offices?.map(mapOfficeCallback))
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.office.header') }))
      }
    }
  })

  const addOffice = (officeToAdd) => {
    if (officeToAdd) {
      const { cityName, regionName, countryCode } = officeToAdd
      const office = {
        name: [cityName, regionName, countryCode].join(OFFICE_NAME_PARTS_SEPARATOR),
        cityName,
        regionName,
        countryCode
      }
      setOffices([...offices.filter(({ name }) => name !== office.name), office])
      setIsDirty(true)
    }
  }

  const removeOffice = (office) => {
    setOffices([...offices.filter(label => label !== office)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      updateOrganizationOffices({
        variables: {
          slug: organization.slug,
          offices: offices.map(({ name, ...mutationVars }) => mutationVars) // eslint-disable-line
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const onCancel = () => {
    setOffices(organization.offices?.map(mapOfficeCallback))
    setIsDirty(false)
  }

  const displayModeBody = offices.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {offices?.map((office, index) =>
        <div key={`office-${index}`}>
          <CityCard city={office} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.country.label'),
        base: format('ui.organization.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
      {format('ui.office.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2 mb-2'>
        {`${format('app.searchAndAssign')} ${format('office.locations.header')}`}
        <GeocodeAutocomplete
          value={null}
          onChange={addOffice}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {offices.map((office, officeIdx) => (
          <Pill
            key={`location-${officeIdx}`}
            label={office.name}
            onRemove={() => removeOffice(office)}
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

export default OrganizationDetailOffices

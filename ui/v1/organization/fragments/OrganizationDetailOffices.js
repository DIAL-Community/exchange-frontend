import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../../../lib/ToastContext'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import CityCard from '../../city/CityCard'
import GeocodeAutocomplete from '../../shared/form/GeocodeAutocomplete'
import { UPDATE_ORGANIZATION_OFFICES } from '../../shared/mutation/organization'
import { useUser } from '../../../../lib/hooks'
import { DisplayType } from '../../utils/constants'

const OFFICE_NAME_PARTS_SEPARATOR = ', '

const OrganizationDetailOffices = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const mapOfficeCallback = ({ name, slug, city, country, region, latitude, longitude }) => ({
    name,
    slug,
    cityName: city,
    regionName: region,
    countryCode: country?.codeLonger,
    latitude,
    longitude
  })

  const [isDirty, setIsDirty] = useState(false)
  const [offices, setOffices] = useState(organization.offices?.map(mapOfficeCallback))

  const { showToast } = useContext(ToastContext)

  const [updateOrganizationOffices, { data, loading }] = useMutation(UPDATE_ORGANIZATION_OFFICES, {
    onError: () => {
      setIsDirty(false)
      setOffices(organization.offices?.map(mapOfficeCallback))
      showToast(format('toast.offices.update.failure'), 'error', 'top-center')
    },
    onCompleted: (data) => {
      const { updateOrganizationOffices: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setOffices(response?.organization?.offices?.map(mapOfficeCallback))
        showToast(format('toast.offices.update.success'), 'success', 'top-center')
        setIsDirty(false)
      } else {
        setIsDirty(false)
        setOffices(organization.offices?.map(mapOfficeCallback))
        showToast(format('toast.offices.update.failure'), 'error', 'top-center')
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const addOffice = (officeToAdd) => {
    if (officeToAdd) {
      const { cityName, regionName, countryCode, longitude, latitude } = officeToAdd
      const office = {
        name: [cityName, regionName, countryCode].join(OFFICE_NAME_PARTS_SEPARATOR),
        cityName,
        regionName,
        countryCode,
        longitude,
        latitude
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
      const { userEmail, userToken } = user
      updateOrganizationOffices({
        variables: {
          slug: organization.slug,
          offices: offices.map(({ name, ...mutationVars }) => mutationVars) // eslint-disable-line
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
    setOffices(
      data?.updateOrganizationOffices?.organization?.offices?.map(mapOfficeCallback) ??
        organization.offices?.map(mapOfficeCallback)
    )
    setIsDirty(false)
  }

  const displayModeBody = offices.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4'>
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
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
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

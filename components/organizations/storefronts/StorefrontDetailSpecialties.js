import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { BsPatchCheck } from 'react-icons/bs'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_ORGANIZATION_SPECIALTIES } from '../../../mutations/organization'
import { getSpecialtyOptions } from '../../../lib/utilities'

const StorefrontDetailSpecialties = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [isDirty, setIsDirty] = useState(false)
  const [specialties, setSpecialties] = useState(organization.specialties ?? [])

  const [updateSpecialties, { reset, loading }] = useMutation(UPDATE_ORGANIZATION_SPECIALTIES, {
    onCompleted: (data) => {
      const { updateOrganizationSpecialties: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        showToast(format('organization.submit.success'), 'success', 'top-center')
        setSpecialties(response?.organization.specialties)
        setIsDirty(false)
      } else {
        showToast(format('organization.submit.failure'), 'error', 'top-center')
        setSpecialties(organization.specialties ?? [])
        setIsDirty(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('organization.submit.failure'), 'error', 'top-center')
      setSpecialties(organization.specialties ?? [])
      setIsDirty(false)
      reset()
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const addSpecialty = (specialty) => {
    setSpecialties([...specialties.filter(existing => existing !== specialty.value), specialty.label])
    setIsDirty(true)
  }

  const removeSpecialty = (specialty) => {
    setSpecialties([...specialties.filter(existing => existing !== specialty)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateSpecialties({
        variables: {
          slug: organization.slug,
          specialties
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
    setSpecialties(organization.specialties)
    setIsDirty(false)
  }

  const displayModeBody = specialties?.length > 0
    ? (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {specialties.map((specialty, index) =>
          <div key={index} className='border shadow-md rounded-md flex gap-3 px-4'>
            <BsPatchCheck className='my-auto text-emerald-500' />
            <div className='py-3'>{specialty}</div>
          </div>
        )}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('storefront.no-specialty')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('specialty.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='specialty-search'>
        {`${format('app.searchAndAssign')} ${format('specialty.header')}`}
        <Select
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          options={getSpecialtyOptions()}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('specialty.header') })}
          onChange={addSpecialty}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {specialties?.map((specialty, index) => (
          <Pill
            key={`specialty-${index}`}
            label={specialty}
            onRemove={() => removeSpecialty(specialty)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('specialty.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default StorefrontDetailSpecialties

import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { BsPatchCheck } from 'react-icons/bs'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_ORGANIZATION_SPECIALTIES } from '../../shared/mutation/organization'
import { generateSpecialtyOptions } from '../../shared/form/options'

const StorefrontDetailSpecialties = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale } = useRouter()

  const [isDirty, setIsDirty] = useState(false)
  const [specialties, setSpecialties] = useState(organization.specialties ?? [])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateSpecialties, { reset, loading }] = useMutation(UPDATE_ORGANIZATION_SPECIALTIES, {
    onCompleted: (data) => {
      const { updateOrganizationSpecialties: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.specialty.header') }))
        setSpecialties(response?.organization.specialties)
        setIsDirty(false)
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.specialty.header') }))
        setSpecialties(organization.specialties ?? [])
        setIsDirty(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.specialty.header') }))
      setSpecialties(organization.specialties ?? [])
      setIsDirty(false)
      reset()
    }
  })

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
    ? <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-semibold'>
      {specialties.map((specialty, index) =>
        <div key={index} className='bg-gradient-to-r from-workflow-bg-light to-workflow-bg rounded-md'>
          <div className='flex gap-3 px-4 py-5 text-dial-plum'>
            <BsPatchCheck size='1.5em' className='my-auto text-emerald-500' />
            <div className='my-auto'>{specialty}</div>
          </div>
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.specialty.label'),
        base: format('ui.storefront.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.specialty.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.specialty.header')}`}
        <Select
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          options={generateSpecialtyOptions()}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.specialty.header') })}
          onChange={addSpecialty}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {specialties?.map((specialty, index) => (
          <Pill
            key={`specialty-${index}`}
            label={specialty}
            onRemove={() => removeSpecialty(specialty)}
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

export default StorefrontDetailSpecialties

import { useCallback, useContext, useState } from 'react'
import { validate } from 'email-validator'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import ContactCard from '../../contact/ContactCard'
import EditableSection from '../../shared/EditableSection'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import ValidationError from '../../shared/form/ValidationError'
import { UPDATE_ORGANIZATION_CONTACTS } from '../../shared/mutation/organization'
import { DisplayType } from '../../utils/constants'

const inputSectionStyle = 'flex flex-col gap-y-3'

const StorefrontDetailContacts = ({ organization, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [contacts, setContacts] = useState(organization?.contacts)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationContacts, { loading }] = useMutation(UPDATE_ORGANIZATION_CONTACTS, {
    onError() {
      setIsDirty(false)
      setContacts(organization.contacts)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.contact.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationContacts: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setContacts(response?.organization?.contacts)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.contact.header') }))
      } else {
        setIsDirty(false)
        setContacts(organization.contacts)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.contact.header') }))
        reset()
      }
    }
  })

  const isContactNameUnique =
    (name) =>
      !contacts.some(contact => contact.name.toLocaleLowerCase() === name.toLocaleLowerCase())

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: '',
      email: '',
      title: ''
    }
  })

  const addContact = (contact) => {
    reset()
    setIsDirty(true)
    setContacts([...contacts,  contact ])
  }

  const removeContact = (contact) => {
    setContacts([...contacts.filter(({ name }) => name !== contact.name)])
    setIsDirty(true)
  }

  const onCancel = () => {
    setContacts(organization.contacts)
    setIsDirty(false)
  }

  const onSubmit = () => {
    updateOrganizationContacts({
      variables: {
        slug: organization.slug,
        contacts
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const displayModeBody = organization && contacts.length > 0
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {contacts.map((contact, index) =>
        <div key={`project-${index}`}>
          <ContactCard contact={contact} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    :  <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.contact.label'),
        base: format('ui.storefront.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.contact.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <form onSubmit={handleSubmit(addContact)}>
        <div className='flex flex-col gap-y-3'>
          <label className={inputSectionStyle}>
            <div className='text-dial-sapphire required-field'>
              {format('ui.contact.name.label')}
            </div>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input {...field} isInvalid={errors.name} />
              )}
              rules={{
                required: format('validation.required'),
                validate: name => isContactNameUnique(name) || format('organization.validation.contact.uniqueName')
              }}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </label>
          <label className={inputSectionStyle}>
            <div className='text-dial-sapphire required-field'>
              {format('ui.contact.email.label')}
            </div>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input {...field} isInvalid={errors.email} />
              )}
              rules={{
                required: format('validation.required'),
                validate: value => validate(value) || format('validation.email')
              }}
            />
            {errors.email && <ValidationError value={errors.email?.message} />}
          </label>
          <label className={inputSectionStyle}>
            <div>
              {format('ui.contact.title.label')}
            </div>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <Input {...field} />
              )}
            />
          </label>
          <div className='flex my-3'>
            <button type='submit' className='submit-button'>
              {format('app.assign')}
            </button>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          {contacts.map((contact, contactIdx) => (
            <Pill
              key={contactIdx}
              label={`${format('ui.contact.name.label')}: ${contact.name}`}
              onRemove={() => removeContact(contact)}
            />
          ))}
        </div>
      </form>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
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

export default StorefrontDetailContacts

import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { validate } from 'email-validator'
import Pill from '../shared/Pill'
import { Input } from '../shared/Input'
import { ToastContext } from '../../lib/ToastContext'
import ContactCard from '../contacts/ContactCard'
import EditableSection from '../shared/EditableSection'
import { UPDATE_ORGANIZATION_CONTACTS } from '../../mutations/organization'
import ValidationError from '../shared/ValidationError'

const inputSectionStyle = 'flex flex-col gap-y-2 mb-2 mx-4 w-full'

const OrganizationDetailContacts = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [contacts, setContacts] = useState(organization?.contacts)
  const [isDirty, setIsDirty] = useState(false)

  const [updateOrganizationContacts, { data, loading }] = useMutation(UPDATE_ORGANIZATION_CONTACTS)

  const { data: session } = useSession()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

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
    },
  })

  const addContact = (contact) => {
    setContacts([...contacts,  contact ])
    setIsDirty(true)
    reset()
  }

  useEffect(() => {
    if (data?.updateOrganizationContacts?.errors.length === 0 && data?.updateOrganizationContacts?.organization) {
      setContacts(data.updateOrganizationContacts.organization.contacts)
      setIsDirty(false)
      showToast(format('organization.contacts.updated'), 'success', 'top-center')
    }
  }, [data, showToast, format])

  const removeContact = (contact) => {
    setContacts([...contacts.filter(({ name }) => name !== contact.name)])
    setIsDirty(true)
  }

  const onCancel = () => {
    setContacts(data?.updateOrganizationContacts?.organization?.contacts ?? organization.contacts)
    setIsDirty(false)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      updateOrganizationContacts({
        variables: {
          slug: organization.slug,
          contacts
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

  const displayModeBody = organization && contacts.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {contacts.map((contact, index) => <ContactCard key={index} contact={contact} listType='list'/>)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>{format('organization.no-contact')}</div>
    )

  const editModeBody =
    <>
      <form onSubmit={handleSubmit(addContact)}>
        <p className='card-title text-dial-blue mb-3'>
          {format('app.assign')} {format('contact.header')}
        </p>
        <div className='flex flex-col md:flex-row justify-between'>
          <label className={inputSectionStyle}>
            <p className='required-field'>
              {format('contact.name.label')}
            </p>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input {...field} data-testid='name-input' isInvalid={errors.name} />
              )}
              rules={{
                required: format('validation.required'),
                validate: name => isContactNameUnique(name) || format('organization.validation.contact.uniqueName')
              }}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </label>
          <label className={inputSectionStyle}>
            <p className='required-field'>
              {format('contact.email.label')}
            </p>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input {...field} data-testid='email-input' isInvalid={errors.email} />
              )}
              rules={{
                required: format('validation.required'),
                validate: value => validate(value) || format('validation.email')
              }}
            />
            {errors.email && <ValidationError value={errors.email?.message} />}
          </label>
          <label className={inputSectionStyle}>
            <p>
              {format('contact.title.label')}
            </p>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <Input {...field} data-testid='title-input'/>
              )}
            />
          </label>
          <label className='flex md:block justify-center md:justify-end ml-4 mb-2 mt-8 text-xl'>
            <button
              type='submit'
              data-testid='assign-button'
              className='submit-button'
            >
              {format('app.assign')}
            </button>
          </label>
        </div>
        <div className='flex flex-wrap gap-3 mt-5 mx-4'>
          {contacts.map((contact, contactIdx) => (
            <Pill
              key={contactIdx}
              label={`${format('contact.name.label')} ${contact.name}`}
              onRemove={() => removeContact(contact)}
            />
          ))}
        </div>
      </form>
    </>

  return (
    <div data-testid='organization-contacts'>
      <EditableSection
        canEdit={true}
        sectionHeader={format('contact.header')}
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

export default OrganizationDetailContacts

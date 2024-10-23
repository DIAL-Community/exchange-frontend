import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_CONTACT } from '../../shared/mutation/contact'
import { CONTACT_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_CONTACTS_QUERY } from '../../shared/query/contact'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const ContactForm = React.memo(({ contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = contact?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateContact, { reset }] = useMutation(CREATE_CONTACT, {
    refetchQueries: [{
      query: CONTACT_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_CONTACTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createContact.contact && data.createContact.errors.length === 0) {
        const redirectPath = `/${locale}/contacts/${data.createContact.contact.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.contact.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.contact.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.contact.label') }))
      reset()
    }
  })

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: contact?.name,
      email: contact?.email,
      title: contact?.title
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const { name, email, title } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      name,
      slug,
      email,
      title,
      source: 'exchange'
    }

    updateContact({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/contacts/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {contact
              ? format('app.editEntity', { entity: contact.name })
              : `${format('app.createNew')} ${format('contact.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('ui.contact.name.label')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('ui.contact.name.label')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('ui.contact.email.label')}
            </label>
            <Input
              {...register('email', { required: format('validation.required') })}
              id='email'
              placeholder={format('ui.contact.email.label')}
              isInvalid={errors.email}
            />
            {errors.email && <ValidationError value={errors.email?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('ui.contact.title.label')}
            </label>
            <Input
              {...register('title', { required: format('validation.required') })}
              id='title'
              placeholder={format('ui.contact.title.label')}
              isInvalid={errors.title}
            />
            {errors.title && <ValidationError value={errors.title?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.contact.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            <button
              type='button'
              className='cancel-button'
              disabled={mutating || reverting}
              onClick={cancelForm}
            >
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3' />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
})

ContactForm.displayName = 'ContactForm'

export default ContactForm

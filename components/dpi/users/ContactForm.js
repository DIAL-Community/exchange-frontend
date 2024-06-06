import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_CONTACT } from '../../shared/mutation/contact'
import { USER_CONTACT_DETAIL_QUERY } from '../../shared/query/contact'

const ContactForm = ({ user, contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user: loggedInUser, loadingUserSession } = useUser()

  const router = useRouter()
  const { locale, asPath } = router

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const successRedirectPath = () => {
    if (asPath.indexOf('dpi-admin/profile') >= 0) {
      return '/dpi-admin/profile'
    } else if (asPath.indexOf('dpi-admin/users') >= 0) {
      return `/dpi-admin/users/${user.id}`
    } else {
      return '/dpi-dashboard/profile'
    }
  }

  const [updateContact, { reset }] = useMutation(CREATE_CONTACT, {
    refetchQueries:[{
      query: USER_CONTACT_DETAIL_QUERY,
      variables: { userId: user?.id, email: user?.email, source: 'adli' }
    }],
    onCompleted: (data) => {
      const { createContact: response } = data
      if (response.contact && response.errors.length === 0) {
        const redirectHandler = () => router.push(successRedirectPath())
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
      title: contact?.title,
      email: user?.email
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const slug = contact?.slug ?? ''
      const { userEmail, userToken } = user
      const {
        name,
        email,
        title
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        slug,
        name,
        email,
        title,
        source: 'adli'
      }

      updateContact({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelRedirectPath = () => {
    if (asPath.indexOf('dpi-admin/profile') >= 0) {
      return '/dpi-admin/profile'
    } else if (asPath.indexOf('dpi-admin/users') >= 0) {
      return `/dpi-admin/users/${user.id}`
    } else {
      return '/dpi-dashboard/profile'
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(cancelRedirectPath(contact))
  }

  return loadingUserSession
    ? <Loading />
    : loggedInUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {contact
                ? format('app.editEntity', { entity: contact.name })
                : `${format('app.createNew')} ${format('ui.contact.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
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
              <label className='required-field' htmlFor='name'>
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
              <label className='required-field' htmlFor='name'>
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
            <div className='flex flex-wrap gap-3'>
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
        </form>
      )
      : <Unauthorized />
}

export default ContactForm

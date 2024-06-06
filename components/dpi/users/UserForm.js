import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useEmailValidation, useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import Checkbox from '../../shared/form/Checkbox'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_ADLI_USER } from '../../shared/mutation/user'

const UserForm = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user: loggedInUser, loadingUserSession } = useUser()

  const router = useRouter()
  const { locale, asPath } = router

  const [roles, setRoles] = useState(user ? user.roles : [])

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const { isUniqueUserEmail } = useEmailValidation()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { handleSubmit, register, watch, setValue, formState: { errors } } = useForm({
    mode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      roles: user?.roles,
      email: user?.email,
      username: user?.username,
      confirmed: user?.confirmed
    }
  })

  const emailWatcher = watch('email')
  useEffect(() => {
    if (emailWatcher) {
      const emailMarkerIndex = emailWatcher.indexOf('@') >= 0 ? emailWatcher.indexOf('@') : emailWatcher.length
      const defaultUsername = emailWatcher.substring(0, emailMarkerIndex)
      setValue('username', defaultUsername)
    }
  }, [emailWatcher, setValue])

  const cancelRedirectPath = (user) => {
    if (asPath.indexOf('dpi-admin/profile') >= 0) {
      return '/dpi-admin/profile/'
    } else {
      return `/dpi-admin/users/${user?.id ?? ''}`
    }
  }

  const successRedirectPath = (user) => {
    if (asPath.indexOf('dpi-admin/profile') >= 0) {
      return '/dpi-admin/profile'
    } else {
      return `/dpi-admin/users/${user?.id ?? ''}`
    }
  }

  const [updateUser, { called, reset }] = useMutation(CREATE_ADLI_USER, {
    onCompleted: (data) => {
      const { createAdliUser: response } = data
      if (response?.user && response?.errors?.length === 0) {
        setMutating(false)
        const redirectHandler = () => router.push(successRedirectPath(response?.user))
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.user.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.user.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.user.label') }))
      reset()
    }
  })

  const doUpsert = async (data) => {
    if (loggedInUser) {
      setMutating(true)
      const { userEmail, userToken } = loggedInUser

      const { email, username, confirmed } = data
      updateUser({
        variables: {
          email,
          roles,
          username,
          confirmed
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

  const addRole = (selectedRole) => {
    setRoles([...roles.filter((role) => role !== selectedRole.value), selectedRole.value ])
  }

  const removeRole = (role) => {
    setRoles([...roles.filter((userRole) => userRole !== role)])
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(cancelRedirectPath(user))
  }

  const roleOptions = [
    { label: 'adli_admin', value: 'adli_admin' },
    { label: 'adli_user', value: 'adli_user' }
  ]

  return loadingUserSession
    ? <Loading />
    : loggedInUser.isAdminUser || loggedInUser.isAdliAdminUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {user
                ? format('app.editEntity', { entity: user.username })
                : `${format('app.createNew')} ${format('user.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='email'>
                {format('user.email')}
              </label>
              <Input
                {...register('email', {
                  required: format('validation.required'),
                  validate: value => isUniqueUserEmail(value, user)
                })}
                isInvalid={errors.email}
                placeholder={format('user.email.placeholder')}
              />
              {errors.email && <ValidationError value={errors.email?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='username' >
                {format('user.username')}
              </label>
              <Input
                {...register('username', { required: format('validation.required') })}
                isInvalid={errors.username}
                placeholder={format('user.username.placeholder')}
              />
              {errors.username && <ValidationError value={errors.username?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='roles'>
                {format('user.roles')}
              </label>
              <Select
                options={roleOptions}
                placeholder={format('user.roles.placeholder')}
                onChange={addRole}
                value={null}
              />
              {roles.length > 0 &&
                <div className='flex flex-wrap gap-3'>
                  {roles.map((role, roleIdx) => (
                    <Pill
                      key={`roles-${roleIdx}`}
                      label={role}
                      onRemove={() => removeRole(role)}
                    />
                  ))}
                </div>
              }
            </div>
            <label className='flex gap-x-2 items-center my-auto'>
              <Checkbox {...register('confirmed')} />
              {format('user.confirmed')}
            </label>
            <div className='flex flex-wrap gap-3'>
              <button
                className='submit-button'
                type='submit' disabled={called}
              >
                {format('user.submit')}
                {called && <FaSpinner className='spinner ml-3' />}
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

export default UserForm

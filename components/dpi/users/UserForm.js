import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useEmailValidation, useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Error, Loading, NotFound, Unauthorized } from '../../shared/FetchStatus'
import Checkbox from '../../shared/form/Checkbox'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_USER } from '../../shared/mutation/user'
import { USER_FORM_SELECTION_QUERY } from '../../shared/query/user'

const UserForm = React.memo(({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const id = user?.id ?? ''
  const { user: currentUser, loadingUserSession } = useUser()

  const router = useRouter()
  const [roles, setRoles] = useState(user ? user.roles : [])

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { locale } = useRouter()
  const { isUniqueUserEmail } = useEmailValidation()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  useEffect(() => {
  }, [])

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      roles: user?.roles,
      email: user?.email,
      username: user?.username,
      products: user?.products.map(prod => prod.name),
      confirmed: user?.confirmed
    }
  })

  const [updateUser, { called, reset }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      const { createUser: response } = data
      if (response?.user && response?.errors?.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}/users/${data.createUser.user.id}`
        const redirectHandler = () => router.push(redirectPath)
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

  const { loading, error, data } = useQuery(USER_FORM_SELECTION_QUERY)
  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.organizations && !data.userRoles) {
    return <NotFound />
  }

  const { userRoles } = data

  const roleOptions =  userRoles?.map(role => ({ label: role, value: role }))

  const doUpsert = async (data) => {
    if (currentUser) {
      setMutating(true)
      const { userEmail, userToken } = currentUser

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
    setRoles([...roles.filter((role) => role !== selectedRole.label), selectedRole.label ])
  }

  const removeRole = (role) => {
    setRoles([...roles.filter((userRole) => userRole !== role)])
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/users/${id}`)
  }

  return loadingUserSession
    ? <Loading />
    : currentUser.isAdminUser || currentUser.isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-stratos'>
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
          </div>
        </form>
      )
      : <Unauthorized />
})

UserForm.displayName = 'UserForm'

export default UserForm

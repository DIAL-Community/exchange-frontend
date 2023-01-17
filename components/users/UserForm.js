import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useEmailValidation } from '../../lib/hooks'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { CREATE_USER } from '../../mutations/users'
import { ORGANIZATION_SEARCH_QUERY } from '../../queries/organization'
import { USER_ROLES } from '../../queries/user'
import { ProductAutocomplete, ProductFilters } from '../filter/element/Product'
import Breadcrumb from '../shared/breadcrumb'
import Checkbox from '../shared/Checkbox'
import Input from '../shared/Input'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import ValidationError from '../shared/ValidationError'

export const UserForm = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const [products, setProducts] = useState(user?.products.map(({ name, slug }) => ({ label: name, slug })) ?? [])
  const [userRoles, setUserRoles] = useState(user?.roles ?? [])
  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const { data: userRolesData } = useQuery(USER_ROLES)

  const { data: organizationsData } = useQuery(ORGANIZATION_SEARCH_QUERY, {
    variables: { search: '' },
  })

  const { isUniqueUserEmail } = useEmailValidation()

  const organizationOptions = useMemo(() => (
    organizationsData?.organizations?.map(
      ({ slug, name, id, website }) => ({
        label: name,
        value: id,
        slug,
        domain: website
      })
    ) ?? []
  ), [organizationsData?.organizations])

  const roleOptions = useMemo(() => userRolesData?.userRoles?.map(role => ({ label: role, value: role })), [userRolesData])

  const userProfilePageUrl = useCallback((data) => `/${locale}/users/${data.createUser.user.id}`, [locale])

  const { handleSubmit, register, setValue, control, getValues, formState: { errors } } = useForm({
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

  useEffect(() =>
    setValue('organization', organizationOptions.find(({ slug }) => slug === user?.organization?.slug))
  , [organizationOptions, setValue, user?.organization?.slug])

  const idNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }
    if (user) {
      map[user.id] = user.username
    }

    return map
  }, [user, format])

  const [updateUser, { called, reset }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      showToast(
        format(`${user ? 'toast.user-profile.update.success' : 'toast.user-profile.submit.success'}`),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push(userProfilePageUrl(data))
      )
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format(`${user ? 'toast.user-profile.update.failure' : 'toast.user-profile.submit.failure'}`)}</span>
          <span>{error.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const doUpsert = async (data) => {
    setMutating(true)
    const { email, username, confirmed, organization } = data
    const organizations = organization ? [{ name: organization.label, slug: organization.slug }] : []
    updateUser({ variables: { email, roles: userRoles, products, organizations, username, confirmed } })
  }

  const addRole = (selectedRole) => {
    setUserRoles([...userRoles.filter((role) => role !== selectedRole.label), selectedRole.label ])
  }

  const removeRole = (role) => {
    setUserRoles([...userRoles.filter((userRole) => userRole !== role)])
  }

  const cancelForm = () => {
    setReverting(true)
    if (user) {
      router.push(`/users/${user.id}`)
    } else {
      router.push('/users/')
    }
  }

  const validateOrganizationDomain = (value) => {
    if (value && !user && !value.domain.includes(getValues('email').split('@')[1])) {
      return format('validation.organization-domain')
    }

    return true
  }

  return (
    <div className='flex flex-col'>
      <div className='lg:w-2/5 mx-auto px-4 font-bold text-xl text-dial-blue'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={idNameMapping} />
        </div>
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div
              className={`
                sm:w-full md:w-2/3 lg:w-2/5 bg-edit shadow-md rounded
                px-8 pt-6 pb-12 mb-4 mx-auto flex flex-col gap-3
              `}
            >
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {user
                  ? format('app.edit-entity', { entity: user.username })
                  : `${format('app.create-new')} ${format('user.label')}`}
              </div>
              <div className='flex flex-col lg:flex-col gap-4'>
                <div className='form-field-wrapper' data-testid='email-label'>
                  <label className='form-field-label required-field' htmlFor='email'>
                    {format('user.email')}
                  </label>
                  <Input
                    {...register('email', {
                      required: format('validation.required'),
                      validate: value => isUniqueUserEmail(value, user)
                    })}
                    isInvalid={errors.email}
                    data-testid='email-input'
                    placeholder={format('user.email.placeholder')}
                  />
                  {errors.email && <ValidationError value={errors.email?.message} />}
                </div>
                <div className='form-field-wrapper' data-testid='username-label'>
                  <label className='form-field-label required-field' htmlFor='username' >
                    {format('user.username')}
                  </label>
                  <Input
                    {...register('username', { required: format('validation.required') })}
                    isInvalid={errors.username}
                    data-testid='username-input'
                    placeholder={format('user.username.placeholder')}
                  />
                  {errors.username && <ValidationError value={errors.username?.message} />}
                </div>
                <div className='form-field-wrapper'>
                  <label className='form-field-label' htmlFor='roles'>
                    {format('user.roles')}
                  </label>
                  <Select
                    options={roleOptions}
                    placeholder={format('user.roles.placeholder')}
                    onChange={addRole}
                    value={null}
                  />
                  {userRoles.length > 0 &&
                      <div className='flex flex-wrap gap-3'>
                        {userRoles.map((role, roleIdx) => (
                          <Pill
                            key={`roles-${roleIdx}`}
                            label={role}
                            onRemove={() => removeRole(role)}
                          />
                        ))}
                      </div>
                  }
                </div>
                <div className='form-field-wrapper'>
                  <label className='form-field-label' htmlFor='organization' data-testid='organization-search'>
                    {format('user.organization')}
                  </label>
                  <Controller
                    name='organization'
                    control={control}
                    defaultValue={organizationOptions.find(({ slug }) => slug === user?.organization?.slug)}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isSearch
                        options={organizationOptions}
                        placeholder={format('user.organization.placeholder')}
                        isInvalid={errors.organization}
                        isClearable
                      />
                    )}
                    rules={{ validate: validateOrganizationDomain }}
                  />
                  {errors.organization ? <ValidationError value={errors.organization?.message} /> : !user && (
                    <div className='h5 w-full pl-2 text-dial-gray-dark normal-case'>
                      {format('user.organization.inform.message')}
                    </div>
                  )}
                </div>
                <div className='form-field-wrapper'>
                  <label className='form-field-label' htmlFor='product'>
                    {format('user.products')}
                  </label>
                  <ProductAutocomplete {...{ products, setProducts, placeholder: format('user.products.placeholder') } } />
                  {products.length > 0 &&
                      <div className='flex flex-wrap gap-x-3'>
                        <ProductFilters {...{ products, setProducts }} />
                      </div>
                  }
                </div>
                <label className='flex gap-x-2 items-center form-field-label my-auto' data-testid='user-is-confirmed'>
                  <Checkbox {...register('confirmed')} />
                  {format('user.confirmed')}
                </label>
                <div className='flex flex-wrap text-xl mt-8 gap-3'>
                  <button
                    className='submit-button'
                    type='submit' disabled={called}
                    data-testid='submit-button'
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
        </div>
      </div>
    </div>
  )
}

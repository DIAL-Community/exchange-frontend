import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { UPDATE_USER} from '../../mutations/users'
import { OrganizationAutocomplete, OrganizationFilters } from '../filter/element/Organization'
import { ProductAutocomplete, ProductFilters } from '../filter/element/Product'
import Breadcrumb from '../shared/breadcrumb'
import Checkbox from '../shared/Checkbox'
import { emailRegex } from '../shared/emailRegex'
import Input from '../shared/Input'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import ValidationError from '../shared/ValidationError'

const sectionStyle = 'w-full flex flex-col'
const sectionLabelStyle = 'form-field-wrapper form-field-label'

export const UserForm = ({ user, action }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  
  const router = useRouter()
  const [organizations, setOrganizations] = useState((user?.organization) ? [{ label: user.organization.name, slug: user.organization.slug }] : [])
  const [products, setProducts] = useState(user?.products.map(({name, slug}) => ({ label: name, slug }) ) ?? [])
  const [userRoles, setUserRoles] = useState(user.roles)
  
  const { locale } = useRouter()
  
  const { showToast } = useContext(ToastContext)
  
  const userProfilePageUrl = (data) => `/${locale}/users/${data.updateUser.user.id}`
  const roleOptions = user.allRoles.map(role => ({ label: role, value: role }) )
  
  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      roles: user.roles,
      email: user.email,
      username: user.username,
      organization: user.organization && user.organization.name,
      products: user.products.map(prod => prod.name),
      confirmed: user.confirmed
    }
  })
  
  const idNameMapping = (() => {
    const map = {}
    if (user) {
      map[user.id] = user.username
    }

    return map
  })()
  
  const [updateUser, { data, called, reset }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      showToast(
        format('toast.user-profile.update.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push(userProfilePageUrl(data))
      )
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{format('toast.user-profile.update.failure')}</span>
          <span>{error.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })
  
  const doUpsert = async (data) => {
    const { email, username, confirmed } = data
    updateUser({ variables: { email, roles: userRoles, products, organizations, username, confirmed } })
  }
  
  const addRole = (selectedRole) => {
    setUserRoles([...userRoles.filter((role) => role !== selectedRole.label), selectedRole.label ])
  }
  
  const removeRole = (role) => {
    setUserRoles([...userRoles.filter((userRole) => userRole !== role)])
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
            <div className='sm:w-full md:w-2/3 lg:w-2/5 bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 mx-auto flex flex-col gap-3'>
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {action === 'update' && format('app.edit-entity', { entity: user.username })}
              </div>
              <div className='flex flex-col lg:flex-col gap-4'>
                <div className={sectionStyle}>
                  <label className={sectionLabelStyle} htmlFor='name' data-testid='email-label'>
                    <p className='required-field'>{format('user.email')}</p>
                    <Input
                      {...register('email', {
                        required: format('validation.required'),
                        pattern: { value: emailRegex, message: format('validation.email') }
                      })}
                      isInvalid={errors.email}
                      data-testid='email-input'
                    />
                    {errors.email && <ValidationError value={errors.email?.message} />}
                  </label>
                </div>
                <div className={sectionStyle}>
                  <label className={sectionLabelStyle} htmlFor='name' data-testid='username-label'>
                    <p className='required-field'>{format('user.username')}</p>
                    <Input
                      {...register('username', { required: format('validation.required') })}
                      isInvalid={errors.username}
                      data-testid='username-input'
                    />
                    {errors.username && <ValidationError value={errors.username?.message} />}
                  </label>
                </div>
                <div className={sectionStyle}>
                  <label className={sectionLabelStyle} htmlFor='name'>
                    <p>{format('user.roles')}</p>
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
                  </label>
                </div>
                <div className={sectionStyle}>
                  <label className={sectionLabelStyle} htmlFor='name'>
                    <p>{format('user.organization')}</p>
                    <OrganizationAutocomplete {...{ organizations, setOrganizations }} />
                    {organizations.length > 0 &&
                    <div className='flex flex-wrap gap-3'>
                      <OrganizationFilters {...{ organizations, setOrganizations }} />
                    </div>
                    }
                  </label>
                </div>
                <div className={sectionStyle}>
                  <label className={sectionLabelStyle} htmlFor='name'>
                    <p>{format('user.products')}</p>
                    <ProductAutocomplete {...{ products, setProducts }} />
                    {organizations.length > 0 &&
                      <div className='flex flex-wrap gap-3'>
                        <ProductFilters {...{ products, setProducts }} />
                      </div>
                    }
                  </label>
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
                    {format('plays.submit')}
                    {called && <FaSpinner className='spinner ml-3' />}
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

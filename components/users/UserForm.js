import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'

import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'

import { OrganizationAutocomplete, OrganizationFilters } from '../filter/element/Organization'
import { ProductAutocomplete, ProductFilters } from '../filter/element/Product'
import Breadcrumb from '../shared/breadcrumb'

const UPDATE_USER = gql`
mutation ($email: String!, $roles: JSON!, $products: JSON!, $organizations: JSON!, $username: String!) {
  updateUser(email: $email, roles: $roles, products: $products, organizations: $organizations, username: $username) {
    user {
      id
      email
      username
      roles
      products {
        name
        slug
      }
      organization {
        name
        slug
      }
    }
  }
}
`

export const UserForm = ({ user, action }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const { handleSubmit, register, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      roles: user.roles,
      email: user.email,
      username: user.username,
      organization: user.organization && user.organization.name,
      products: user.products.map(prod => prod.name)
    }
  })

  const router = useRouter()
  const [organizations, setOrganizations] = useState((user && user.organization) ? [{ label: user.organization.name, slug: user.organization.slug }] : [])
  const [products, setProducts] = useState(user ? user.products.map(product => { return { label: product.name, slug: product.slug } }) : [])

  const idNameMapping = (() => {
    const map = {}
    if (user) {
      map[user.id] = user.username
    }
    return map
  })()

  const [updateUser, { data, loading }] = useMutation(UPDATE_USER)

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/users/${data.updateUser.user.id}`)
      }, 2000)
    }
  }, [data])

  const doUpsert = async (data, e) => {
    const { email, roles, username } = data
    updateUser({ variables: { email, roles, products, organizations, username } })
  }

  const options = user.allRoles.map(role => { return { label: role, value: role } })

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{action === 'create' ? format('play.created') : format('play.updated')}</div>
      </div>
      <div className='px-4 font-bold text-xl text-dial-blue'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={idNameMapping} />
        </div>
        {action === 'update' && format('app.edit-entity', { entity: user.username })}
      </div>
      <div id='content' className='px-4 sm:px-0 max-w-full mx-auto'>
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('user.email')}
              </label>
              <input {...register('email', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('user.username')}
              </label>
              <input {...register('username', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker h4 mb-2' htmlFor='name'>
                {format('user.roles')}
              </label>
              <Controller
                name='roles'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => {
                  return (
                    <Select
                      options={options}
                      placeholder={format('user.roles.placeholder')}
                      isMulti
                      onChange={(options) => onChange(options?.map((option) => option.value))}
                      onBlur={onBlur}
                      value={options.filter((option) => value?.includes(option.value))}
                    />
                  )
                }}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker h4 mb-2' htmlFor='name'>
                {format('user.organization')}
              </label>
              <OrganizationAutocomplete {...{ organizations, setOrganizations }} containerStyles='px-2 pb-2' />
              <div className='flex flex-cols-4'>
                <OrganizationFilters {...{ organizations, setOrganizations }} />
              </div>
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker h4 mb-2' htmlFor='name'>
                {format('user.products')}
              </label>
              <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' />
              <div className='flex flex-cols-4'>
                <ProductFilters {...{ products, setProducts }} />
              </div>
            </div>
            <div className='flex items-center justify-between font-semibold text-sm mt-3'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                type='submit' disabled={loading}
              >
                {format('plays.submit')}
                {loading && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

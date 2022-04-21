/* global fetch:false */

import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useState } from 'react'
import Link from 'next/link'
import { FaRegQuestionCircle, FaSpinner } from 'react-icons/fa'
import { gql, useApolloClient } from '@apollo/client'
import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import zxcvbn from 'zxcvbn'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ClientOnly from '../../lib/ClientOnly'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String!) {
    organizations(search: $search) {
      id
      name
    }
  }
`

const PRODUCT_SEARCH_QUERY = gql`
  query Products($search: String!) {
    products(search: $search) {
      id
      name
    }
  }
`

const TextFieldDefinition = (initialState) => {
  const [fields, setFields] = useState(initialState)
  const [fieldValidations, setFieldValidations] = useState(initialState)

  const validateFields = (event) => {
    const id = event.target.id

    let validationValue
    if (id === 'password') {
      validationValue = zxcvbn(event.target.value).score
    } else if (id === 'passwordConfirmation') {
      validationValue = event.target.value && event.target.value === fields.password
    }

    setFieldValidations({
      ...fieldValidations,
      [event.target.id]: validationValue
    })
  }

  return [
    fields,
    function handleFieldChange (event) {
      validateFields(event)
      setFields({
        ...fields,
        [event.target.id]: event.target.value
      })
    },
    function resetFields () {
      setFields({ ...initialState })
    },
    fieldValidations
  ]
}

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: 'auto',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

const strengthClasses = {
  0: 'strength-meh',
  1: 'strength-weak',
  2: 'strength-ok',
  3: 'strength-decent',
  4: 'strength-good'
}

const SignUp = () => {
  const router = useRouter()
  const client = useApolloClient()
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [products, setProducts] = useState('')
  const [organization, setOrganization] = useState('')
  const [captcha, setCaptcha] = useState('')

  const [textFields, handleTextChange, resetTextFields, fieldValidations] = TextFieldDefinition({
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 1) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.organizations) {
      return response.data.organizations.map((organization) => ({
        label: organization.name,
        value: organization.id
      }))
    } else if (response.data && response.data.products) {
      return response.data.products.map((product) => ({
        label: product.name,
        value: product.id
      }))
    }

    return []
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const signUpBody = {
      user: {
        email: textFields.email,
        username: textFields.email.split('@')[0],
        password: textFields.password,
        password_confirmation: textFields.passwordConfirmation
      },
      'g-recaptcha-response': captcha
    }

    if (organization) {
      signUpBody.user.organization_id = parseInt(organization.value)
    }

    if (products && products.length > 0) {
      signUpBody.user.user_products = products.map(product => parseInt(product.value))
    }

    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/authenticate/signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      },
      body: JSON.stringify(signUpBody)
    })

    if (response.status === 201) {
      resetTextFields()
      setCreated(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }

    setLoading(false)
  }

  const removeProduct = (product) => {
    setProducts(products.filter(p => p.value !== product.value))
  }

  const strengthColor = (strength) => {
    if (textFields.password.length === 0) {
      return ''
    }

    return strengthClasses[strength]
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ReactTooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      <ClientOnly>
        <div className='bg-dial-gray-dark h-screen'>
          <div className={`mx-4 ${created ? 'visible' : 'invisible'} text-center pt-4`}>
            <div className='my-auto text-emerald-500'>{format('signUp.created')}</div>
          </div>
          <div className='pt-4'>
            <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
              <form method='post' onSubmit={handleSubmit}>
                <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
                  <div className='mb-4'>
                    <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='email'>
                      {format('signUp.email')}
                    </label>
                    <input
                      id='email' name='email' type='email' placeholder={format('signUp.email.placeholder')}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                      value={textFields.email} onChange={handleTextChange}
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='password'>
                      {format('signUp.password')}
                    </label>
                    <input
                      id='password' name='password' type='password' placeholder='******************'
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                      value={textFields.password} onChange={handleTextChange}
                    />
                    <div className='strength-meter my-2'>
                      <div className={`strength-meter-fill ${strengthColor(fieldValidations.password)}`} />
                      {fieldValidations.password > 0 && fieldValidations.password < 2 && (
                        <div className='p-1 text-sm text-use-case'>{format('signUp.moreSecure')}</div>
                      )}
                    </div>
                  </div>
                  <div className='mb-4'>
                    <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='passwordConfirmation'>
                      {format('signUp.passwordConfirmation')}
                    </label>
                    <input
                      id='passwordConfirmation' name='passwordConfirmation' type='password' placeholder='******************'
                      className={`
                        ${fieldValidations.passwordConfirmation === false ? 'border-4 border-red-500' : ''}
                        shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker
                      `}
                      value={textFields.passwordConfirmation} onChange={handleTextChange}
                    />
                    <p className='text-red text-xs italic mt-2'>{format('signUp.passwordConfirmation.hint')}</p>
                  </div>
                  <div className='mb-4 text-gray-dark flex'>
                    <label className='block w-full'>
                      <span className='block text-grey-darker text-sm font-bold mb-2'>
                        {format('organization.label')}
                        <FaRegQuestionCircle
                          className='ml-3 float-right'
                          data-tip={format('signUp.tooltip.organizationOwner')}
                        />
                      </span>
                      <AsyncSelect
                        className='rounded text-sm text-dial-gray-dark block w-full'
                        cacheOptions
                        defaultOptions
                        loadOptions={(input, callback) => fetchOptions(input, callback, ORGANIZATION_SEARCH_QUERY)}
                        noOptionsMessage={() => format('filter.searchFor', { entity: format('organization.label') })}
                        onChange={setOrganization}
                        placeholder={format('signUp.organization')}
                        styles={customStyles}
                        value={organization}
                        isClearable
                      />
                    </label>
                  </div>
                  <div className='text-gray-dark flex'>
                    <label className='block w-full'>
                      <span className='block text-grey-darker text-sm font-bold mb-2'>
                        {format('product.label')}
                        <FaRegQuestionCircle
                          className='ml-3 float-right'
                          data-tip={format('signUp.tooltip.productOwner')}
                        />
                      </span>
                      <AsyncSelect
                        className='rounded text-sm text-dial-gray-dark my-auto'
                        cacheOptions
                        defaultOptions
                        loadOptions={(input, callback) => fetchOptions(input, callback, PRODUCT_SEARCH_QUERY)}
                        noOptionsMessage={() => format('filter.searchFor', { entity: format('product.header') })}
                        onChange={(e) => setProducts([...products, e])}
                        placeholder={format('signUp.products')}
                        menuPlacement='top'
                        styles={customStyles}
                        value={products[products.length - 1]}
                      />
                    </label>
                  </div>
                  <div className='flex flex-row flex-wrap mb-4'>
                    {
                      products && products.length > 0 &&
                        products.map((product, index) => {
                          return (
                            <div className='text-xs rounded text-dial-gray-dark bg-dial-yellow px-2 py-1 mr-2 mt-2' key={index}>
                              {product.label}
                              <MdClose className='ml-2 inline cursor-pointer' onClick={() => removeProduct(product)} />
                            </div>
                          )
                        })
                    }
                  </div>
                  <ReCAPTCHA sitekey='6LfAGscbAAAAAFW_hQyW5OxXPhI7v6X8Ul3FJrsa' onChange={setCaptcha} />
                  <div className='flex items-center justify-between font-semibold text-sm mt-2'>
                    <div className='flex'>
                      <button
                        className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                        type='submit' disabled={loading || fieldValidations.password < 2 || !fieldValidations.passwordConfirmation}
                      >
                        {format('app.signUp')}
                        {loading && <FaSpinner className='spinner ml-3' />}
                      </button>
                    </div>
                    <div className='flex'>
                      <Link href='/auth/signin'>
                        <a
                          className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-yellow'
                          href='navigate-to-signin'
                        >
                          {format('app.signIn')}
                        </a>
                      </Link>
                      <div className='border-r-2 border-dial-gray-dark mx-2' />
                      <Link href='/auth/reset-password'>
                        <a
                          className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-yellow'
                          href='navigate-to-reset'
                        >
                          {format('signIn.forgetPassword')}
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default SignUp

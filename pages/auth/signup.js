import { useIntl } from 'react-intl'
import { useState, useContext, useCallback } from 'react'
import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import zxcvbn from 'zxcvbn'
import { getCsrfToken, getSession } from 'next-auth/react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ClientOnly from '../../lib/ClientOnly'
import { ToastContext } from '../../lib/ToastContext'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

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

const strengthClasses = {
  0: 'strength-meh',
  1: 'strength-weak',
  2: 'strength-ok',
  3: 'strength-decent',
  4: 'strength-good'
}

const SignUp = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [captcha, setCaptcha] = useState('')

  const { showToast } = useContext(ToastContext)

  const [textFields, handleTextChange, resetTextFields, fieldValidations] = TextFieldDefinition({
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const signUpBody = {
      user: {
        email: textFields.email,
        username: textFields.email.split('@')[0],
        password: textFields.password,
        password_confirmation: textFields.passwordConfirmation
      }
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
    } else {
      const errorMsg = await response.json()
      Object.entries(errorMsg).map(item => {
        showToast(
          JSON.stringify(item),
          'error',
          'top-center',
          false
        )
      })
    }

    setLoading(false)
  }

  const strengthColor = (strength) => {
    if (textFields.password.length === 0) {
      return ''
    }

    return strengthClasses[strength]
  }

  return (
    <>
      <Header isOnAuthPage />
      <ReactTooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      <ClientOnly>
        <div className='bg-dial-gray-dark'>
          <div className={`mx-4 ${created ? 'visible' : 'invisible'} text-center pt-4`}>
            <div className='my-auto text-emerald-500'>{format('signUp.created')}</div>
          </div>
          <div className='pt-4 pb-8'>
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
                  <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY} onChange={setCaptcha} />
                  <div className='flex items-center justify-between font-semibold text-sm mt-2'>
                    <div className='flex'>
                      <button
                        className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex disabled:opacity-50'
                        type='submit'
                        disabled={
                          loading ||
                          fieldValidations.password < 2 ||
                          !fieldValidations.passwordConfirmation ||
                          !captcha
                        }
                      >
                        {format('app.signUp')}
                        {loading && <FaSpinner className='spinner ml-3' />}
                      </button>
                    </div>
                    <div className='flex'>
                      <Link href='/auth/signin'>
                        <a
                          className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-sunshine'
                          href='navigate-to-signin'
                        >
                          {format('app.signIn')}
                        </a>
                      </Link>
                      <div className='border-r-2 border-dial-gray-dark mx-2' />
                      <Link href='/auth/reset-password'>
                        <a
                          className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-sunshine'
                          href='navigate-to-reset'
                        >
                          {format('signIn.forgetPassword')}
                        </a>
                      </Link>
                    </div>
                  </div>
                  <div className='h5 mt-2'>
                    {format('signUp.privacy')}
                    <Link href='/privacy-policy'>
                      <a className='text-dial-sunshine'>{format('signUp.privacyLink')}</a>
                    </Link>
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

export async function getServerSideProps (ctx) {
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: '/'
      }
    }
  }

  return {
    props: {
      csrfToken: await getCsrfToken(ctx)
    }
  }
}

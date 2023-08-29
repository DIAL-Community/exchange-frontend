import { useIntl } from 'react-intl'
import { useState, useContext, useCallback } from 'react'
import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import zxcvbn from 'zxcvbn'
import { getCsrfToken, getSession } from 'next-auth/react'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import ClientOnly from '../../lib/ClientOnly'
import { ToastContext } from '../../lib/ToastContext'

const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

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
    } else if (id === 'email') {
      validationValue = event.target.value?.length > 0 && /\S+@\S+\.\S+/.test(event.target.value)
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

    setLoading(false)
    if (response.status === 201) {
      resetTextFields()
      showToast(
        format('signUp.created'),
        'success',
        'top-center',
        3000,
        null,
        () => router.push('/auth/signin')
      )
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
      <Tooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      <ClientOnly>
        <div className='bg-dial-gray-dark min-h-[70vh]'>
          <div className='pt-4 pb-8 text-dial-sapphire'>
            <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
              <form method='post' onSubmit={handleSubmit}>
                <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='block text-sm font-semibold' htmlFor='email'>
                      {format('signUp.email')}
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      placeholder={format('signUp.email.placeholder')}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                      value={textFields.email}
                      onChange={handleTextChange}
                    />
                    {fieldValidations.email === false &&
                      <p className='text-red-500 text-xs mt-2'>{format('signUp.email.invalid')}</p>
                    }
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='block text-sm font-semibold' htmlFor='password'>
                      {format('signUp.password')}
                    </label>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      placeholder='******************'
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                      value={textFields.password}
                      onChange={handleTextChange}
                    />
                    <div className='strength-meter my-2'>
                      <div className={`strength-meter-fill ${strengthColor(fieldValidations.password)}`} />
                      {fieldValidations.password > 0 && fieldValidations.password < 2 && (
                        <div className='p-1 text-sm text-use-case'>{format('signUp.moreSecure')}</div>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='block text-sm font-semibold' htmlFor='passwordConfirmation'>
                      {format('signUp.passwordConfirmation')}
                    </label>
                    <input
                      id='passwordConfirmation'
                      name='passwordConfirmation'
                      type='password'
                      placeholder='******************'
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                      value={textFields.passwordConfirmation}
                      onChange={handleTextChange}
                    />
                    {fieldValidations.passwordConfirmation === false &&
                      <p className='text-red-500 text-xs italic mt-2'>
                        {format('signUp.passwordConfirmation.hint')}
                      </p>
                    }
                  </div>
                  <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY} onChange={setCaptcha} />
                  <div className='flex items-center justify-between font-semibold text-sm'>
                    <div className='flex'>
                      <button
                        className='bg-dial-sapphire text-white py-2 px-4 rounded flex disabled:opacity-50'
                        type='submit'
                        disabled={
                          loading ||
                          fieldValidations.password < 2 ||
                          !fieldValidations.passwordConfirmation ||
                          !fieldValidations.email ||
                          !captcha
                        }
                      >
                        {format('app.signUp')}
                        {loading && <FaSpinner className='spinner ml-3 my-auto' />}
                      </button>
                    </div>
                    <div className='flex gap-2 text-dial-sapphire'>
                      <Link
                        href='/auth/signin'
                        className='border-b-2 border-transparent hover:border-dial-sunshine'
                      >
                        {format('app.signIn')}
                      </Link>
                      <div className='border-r-2 border-dial-gray-dark' />
                      <Link
                        href='/auth/reset-password'
                        className='border-b-2 border-transparent hover:border-dial-sunshine'
                      >
                        {format('signIn.forgetPassword')}
                      </Link>
                    </div>
                  </div>
                  <div className='flex gap-1 text-xs text-dial-stratos'>
                    {format('signUp.privacy')}
                    <Link
                      href='/privacy-policy'
                      className='text-dial-sunshine border-b-2 border-transparent hover:border-dial-sunshine'
                    >
                      {format('signUp.privacyLink')}
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

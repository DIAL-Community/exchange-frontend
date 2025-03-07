import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import zxcvbn from 'zxcvbn'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import { ToastContext } from '../../../lib/ToastContext'

// "user"=>{"reset_password_token"=>"[FILTERED]", "password"=>"[FILTERED]", "password_confirmation"=>"[FILTERED]"}

const strengthClasses = {
  0: 'strength-meh',
  1: 'strength-weak',
  2: 'strength-ok',
  3: 'strength-decent',
  4: 'strength-good'
}

const PasswordAction = () => {
  const router = useRouter()
  const { reset_password_token: resetToken } = router.query

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)

  const [tokenValid, setTokenValid] = useState(false)
  const [tokenValidated, setTokenValidated] = useState(false)

  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const { showToast } = useContext(ToastContext)

  useEffect(
    () => {
      if (resetToken && !tokenValidated) {
        fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/authentication/validate-reset-token', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Set-Cookie',
            'X-User-Token': resetToken
          }
        }).then((response) => {
          setTokenValidated(true)
          setTokenValid(response.status === 200)
        })
      }
    }
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const resetBody = {
      user: {
        password,
        password_confirmation: passwordConfirmation,
        reset_password_token: resetToken
      }
    }

    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/authentication/apply-reset-token', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie',
        'X-User-Token': resetToken
      },
      body: JSON.stringify(resetBody)
    })

    if (response.status === 200) {
      setPassword('')
      setPasswordConfirmation('')
      showToast(
        format('reset.applied'),
        'success',
        'top-center',
        3000,
        null,
        () => router.push('/profiles/me')
      )
    }

    setLoading(false)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setPasswordStrength(zxcvbn(event.target.value).score)
  }

  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value)
  }

  const strengthColor = () => {
    if (password.length === 0) {
      return ''
    }

    return strengthClasses[passwordStrength]
  }

  return (
    <>
      <Header />
      <Tooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      <div className='bg-dial-gray-dark pt-20 max-w-catalog mx-auto min-h-[70vh]'>
        <div className='pt-4'>
          <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
            <form method='post' onSubmit={handleSubmit}>
              <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
                <div className='mb-4'>
                  <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='password'>
                    {format('reset.password')}
                  </label>
                  <input
                    id='password' name='password' type='password' placeholder={format('reset.password.placeholder')}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                    value={password} onChange={handlePasswordChange}
                  />
                  <div className='strength-meter my-2'>
                    <div className={`strength-meter-fill ${strengthColor(password)}`} />
                    {password.length > 0 && passwordStrength < 3 && (
                      <div className='p-1 text-sm text-use-case'>{format('signUp.moreSecure')}</div>
                    )}
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='password'>
                    {format('reset.passwordConfirmation')}
                  </label>
                  <input
                    id='passwordConfirmation' name='passwordConfirmation' type='password'
                    placeholder={format('reset.passwordConfirmation.placeholder')}
                    className={`
                      ${password !== passwordConfirmation ? 'border-4 border-red-500' : ''}
                      shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker
                    `}
                    value={passwordConfirmation} onChange={handlePasswordConfirmationChange}
                  />
                </div>
                <div className='flex items-center justify-between font-semibold text-sm mt-2'>
                  <div className='flex'>
                    <button
                      className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex disabled:opacity-50'
                      type='submit'
                      disabled={loading || password !== passwordConfirmation || passwordStrength < 3 || !tokenValid}
                    >
                      {format('app.updatePassword')}
                      {loading && <FaSpinner className='spinner ml-3' />}
                    </button>
                  </div>
                  {
                    !tokenValid &&
                      <div className='text-sm text-red-500 py-2'>
                        {format('reset.tokenInvalid')}
                      </div>
                  }
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PasswordAction

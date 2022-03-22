/* global fetch:false */
/* global FormData:false */

import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'

import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'

const EntityUpload = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [file, setFile] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [session] = useSession()
  const fileRef = useRef()
  const captchaRef = useRef()

  const handleSubmit = async (event) => {
    setLoading(true)

    event.preventDefault()
    const { userEmail, userToken } = session.user

    const formData = new FormData()
    formData.append('entity_file', file, file.name)
    formData.append('captcha', captcha)
    formData.append('user_email', userEmail)
    formData.append('user_token', userToken)

    const uploadPath = `${process.env.NEXT_PUBLIC_AUTH_SERVER}/entities/process-file`
    const response = await fetch(uploadPath, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      },
      body: formData
    })

    if (response.status === 200) {
      fileRef.current.value = ''
      captchaRef.current.reset()
      setSubmitted(true)
    }

    setLoading(false)
  }

  const onChangeHandler = (event) => {
    setSubmitted(false)
    setFile(event.target.files[0])
  }

  return (
    <div className='bg-dial-gray-dark pt-8' style={{ minHeight: '70vh' }}>
      <div className={`mx-4 ${submitted ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{format('entity.uploaded')}</div>
      </div>
      <div className='pt-4'>
        <div className='bg-white shadow-md rounded px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
          <form method='post' onSubmit={handleSubmit}>
            <div className='px-8 pt-6 pb-4 flex flex-col'>
              <div className='mb-4'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='email'>
                  {format('entity.file')}
                </label>
                <input
                  id='file' name='file' type='file' onChange={onChangeHandler} ref={fileRef}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                />
              </div>
              <ReCAPTCHA sitekey='6LfAGscbAAAAAFW_hQyW5OxXPhI7v6X8Ul3FJrsa' onChange={setCaptcha} ref={captchaRef} />
              <div className={`flex items-center justify-between font-semibold text-sm mt-4 ${file ? '' : 'pb-4'}`}>
                <div className='flex'>
                  <button
                    className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                    type='submit' disabled={loading || !captcha || !session || !session.user}
                  >
                    {format('entity.process')}
                    {loading && <FaSpinner className='spinner ml-3' />}
                  </button>
                </div>
              </div>
            </div>
          </form>
          {
            file && fileRef.current.value !== '' &&
              <div className='px-8 pb-4 text-sm font-semibold'>
                <span>{format('entity.filename')}: {file.name}</span>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default EntityUpload

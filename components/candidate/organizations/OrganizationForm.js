import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const CREATE_CANDIDATE_ORGANIZATION = gql`
  mutation CreateCandidateOrganization(
    $organizationName: String!,
    $website: String!,
    $name: String!,
    $description: String!,
    $email: String!,
    $title: String!,
    $captcha: String!
  ) {
    createCandidateOrganization(
      organizationName: $organizationName,
      website: $website,
      name: $name,
      description: $description,
      email: $email,
      title: $title,
      captcha: $captcha
    ) { slug }
  }
`

const OrganizationForm = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [organizationName, setOrganizationName] = useState('')
  const [website, setWebsite] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [captcha, setCaptcha] = useState('')

  const [createCandidateOrganization, { data, loading }] = useMutation(CREATE_CANDIDATE_ORGANIZATION)

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const router = useRouter()
  const captchaRef = useRef()

  useEffect(() => {
    if (data) {
      setOrganizationName('')
      setEmail('')
      setName('')
      setDescription('')
      setTitle('')
      setWebsite('')
      captchaRef.current.reset()
      setTimeout(() => {
        router.push('/candidate/organizations')
      }, 5000)
    }
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    createCandidateOrganization({
      variables: {
        organizationName,
        website,
        name,
        description,
        email,
        title,
        captcha
      }
    })
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{format('candidateProduct.created')}</div>
      </div>
      <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
        <form method='post' onSubmit={handleSubmit}>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('candidateOrganization.organizationName')}
              </label>
              <input
                id='organizationName' name='organizationName' type='text'
                placeholder={format('candidateOrganization.organizationName.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={organizationName} onChange={(e) => handleTextFieldChange(e, setOrganizationName)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('candidateOrganization.website')}
              </label>
              <input
                id='website' name='website' type='text' placeholder={format('candidateProduct.website.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={website} onChange={(e) => handleTextFieldChange(e, setWebsite)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('candidateOrganization.description')}
              </label>
              <input
                id='website' name='website' type='text' placeholder={format('candidateProduct.description.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={description} onChange={(e) => handleTextFieldChange(e, setDescription)}
              />
            </div>
            <div className='border-b border-dial-gray my-4' />
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='repository'>
                {format('candidateOrganization.name')}
              </label>
              <input
                id='name' name='name' type='text' placeholder={format('candidateOrganization.name.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={name} onChange={(e) => handleTextFieldChange(e, setName)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='passwordConfirmation'>
                {format('candidateOrganization.email')}
              </label>
              <input
                id='email' name='email' type='text' placeholder={format('candidateOrganization.email.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={email} onChange={(e) => handleTextFieldChange(e, setEmail)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('candidateOrganization.title')}
              </label>
              <input
                id='title' name='website' type='text' placeholder={format('candidateOrganization.title.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={title} onChange={(e) => handleTextFieldChange(e, setTitle)}
              />
            </div>
            <ReCAPTCHA sitekey='6LfAGscbAAAAAFW_hQyW5OxXPhI7v6X8Ul3FJrsa' onChange={setCaptcha} ref={captchaRef} />
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                type='submit' disabled={loading}
              >
                {format('candidateOrganization.submit')}
                {loading && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrganizationForm

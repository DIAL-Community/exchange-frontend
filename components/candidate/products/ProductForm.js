import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const CREATE_CANDIDATE_PRODUCT = gql`
  mutation CreateCandidateProduct(
    $name: String!,
    $website: String!,
    $repository: String!,
    $description: String!,
    $email: String!,
    $captcha: String!
  ) {
    createCandidateProduct(
      name: $name,
      website: $website,
      repository: $repository,
      description: $description,
      email: $email,
      captcha: $captcha
    ) { slug }
  }
`

const ProductForm = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [repository, setRepository] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [captcha, setCaptcha] = useState('')

  const [createCandidateProduct, { data, loading }] = useMutation(CREATE_CANDIDATE_PRODUCT)

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const router = useRouter()
  const captchaRef = useRef()

  useEffect(() => {
    if (data) {
      setName('')
      setEmail('')
      setWebsite('')
      setRepository('')
      setDescription('')
      captchaRef.current.reset()
      setTimeout(() => {
        router.push('/candidate/products')
      }, 5000)
    }
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    createCandidateProduct({
      variables: {
        name,
        website,
        repository,
        description,
        email,
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
                {format('candidateProduct.name')}
              </label>
              <input
                id='name' name='name' type='text' placeholder={format('candidateProduct.name.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={name} onChange={(e) => handleTextFieldChange(e, setName)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('candidateProduct.website')}
              </label>
              <input
                id='website' name='website' type='text' placeholder={format('candidateProduct.website.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={website} onChange={(e) => handleTextFieldChange(e, setWebsite)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='repository'>
                {format('candidateProduct.repository')}
              </label>
              <input
                id='repository' name='repository' type='text' placeholder={format('candidateProduct.repository.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={repository} onChange={(e) => handleTextFieldChange(e, setRepository)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='description'>
                {format('candidateProduct.description')}
              </label>
              <input
                id='description' name='description' type='text' placeholder={format('candidateProduct.description.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={description} onChange={(e) => handleTextFieldChange(e, setDescription)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='passwordConfirmation'>
                {format('candidateProduct.email')}
              </label>
              <input
                id='email' name='email' type='text' placeholder={format('candidateProduct.email.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={email} onChange={(e) => handleTextFieldChange(e, setEmail)}
              />
            </div>
            <ReCAPTCHA sitekey='6LfAGscbAAAAAFW_hQyW5OxXPhI7v6X8Ul3FJrsa' onChange={setCaptcha} ref={captchaRef} />
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                type='submit' disabled={loading}
              >
                {format('candidateProduct.submit')}
                {loading && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm

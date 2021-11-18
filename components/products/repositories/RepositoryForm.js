import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import { FaSpinner } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'

const CREATE_PRODUCT_REPOSITORY = gql`
  mutation CreateProductRepository(
    $name: String!,
    $absoluteUrl: String!,
    $description: String!,
    $mainRepository: Boolean!,
  ) {
    createProductRepository(
      name: $name,
      absoluteUrl: $absoluteUrl,
      description: $description,
      mainRepository: $mainRepository,
    ) { slug }
  }
`

const RepositoryForm = ({ productSlug, productRepositorySlug }) => {
  const { formatMessage } = useIntl()
  const [session] = useSession()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [name, setName] = useState('')
  const [absoluteUrl, setAbsoluteUrl] = useState('')
  const [description, setDescription] = useState('')
  const [mainRepository, setMainRepository] = useState(false)

  const [createProductRepository, { data, loading }] =
    useMutation(CREATE_PRODUCT_REPOSITORY)

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const toggleMainRepository = () => {
    setMainRepository(!mainRepository)
  }

  const router = useRouter()
  const captchaRef = useRef()

  useEffect(() => {
    if (data) {
      setName('')
      setAbsoluteUrl('')
      setDescription('')
      setMainRepository(false)
      setTimeout(() => {
        router.push(`/products/${productSlug}/repositories`)
      }, 5000)
    }
  }, [data])

  const handleSubmit = async (e) => {
    if (session.user) {
      e.preventDefault()

      const { userEmail, userToken } = session.user
      createProductRepository({
        context: { headers: { 'Authorization': `${userEmail} ${userToken}` } },
        variables: {
          name,
          absoluteUrl,
          description,
          mainRepository
        }
      })
    }
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{format('productRepository.created')}</div>
      </div>
      <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
        <form method='post' onSubmit={handleSubmit}>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='mb-4'>
              <div className='mb-4'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                  {format('productRepository.name')}
                </label>
                <input
                  id='name' name='name' type='text' placeholder={format('productRepository.name.placeholder')}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                  value={name} onChange={(e) => handleTextFieldChange(e, setName)}
                />
              </div>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='absoluteUrl'>
                {format('productRepository.organizationName')}
              </label>
              <input
                id='absoluteUrl' name='absoluteUrl' type='text'
                placeholder={format('productRepository.absoluteUrl.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={absoluteUrl} onChange={(e) => handleTextFieldChange(e, setAbsoluteUrl)}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('productRepository.description')}
              </label>
              <input
                id='website' name='website' type='text' placeholder={format('productRepository.description.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={description} onChange={(e) => handleTextFieldChange(e, setDescription)}
              />
            </div>
            <div className='border-b border-dial-gray my-4' />
            <div className='px-2 pb-2 flex'>
              <label className='inline-flex items-center'>
                <input
                  type='checkbox' className='h-4 w-4 form-checkbox text-white' name='main-repository'
                  checked={mainRepository} onChange={toggleMainRepository}
                />
                <span className='ml-2'>{format('productRepository.mainRepository.label')}</span>
              </label>
            </div>
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                type='submit' disabled={loading}
              >
                {format('productRepository.submit')}
                {loading && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RepositoryForm

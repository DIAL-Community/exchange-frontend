import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { ToastContext } from '../../../lib/ToastContext'
import {
  CREATE_PRODUCT_REPOSITORY,
  UPDATE_PRODUCT_REPOSITORY
} from '../../../mutations/product'
import ValidationError from '../../shared/ValidationError'
import Input from '../../shared/Input'
import Checkbox from '../../shared/Checkbox'
import { useUser } from '../../../lib/hooks'

const RepositoryForm = ({ productRepository, productSlug }) => {
  const router = useRouter()
  const { user } = useUser()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const submitFailureToast = () => showToast(
    format('product-repository.submit.failure'),
    'error',
    'top-center',
    false
  )

  const submitSuccessToast = (data) => {
    const slug = data.createProductRepository?.slug ?? data.updateProductRepository?.slug

    showToast(
      format('product-repository.submit.success'),
      'success',
      'top-center',
      1000,
      null,
      () =>  router.push(`/products/${productSlug}/repositories/${slug}`)
    )
  }

  const [createProductRepository] = useMutation(CREATE_PRODUCT_REPOSITORY, {
    onError: () => submitFailureToast(),
    onCompleted: (data) => submitSuccessToast(data)
  })

  const [updateProductRepository] = useMutation(UPDATE_PRODUCT_REPOSITORY, {
    onError: () => submitFailureToast(),
    onCompleted: (data) => submitSuccessToast(data)
  })

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: productRepository?.name,
      description: productRepository?.description,
      absoluteUrl: productRepository?.absoluteUrl,
      mainRepository: productRepository?.mainRepository === 'true'
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const { userEmail, userToken } = user
      const { name, absoluteUrl, description, mainRepository } = data

      const graphParameters = {
        context: { headers: { Authorization: `${userEmail} ${userToken}` } },
        variables: {
          slug: productRepository?.slug ?? productSlug,
          name,
          absoluteUrl,
          description,
          mainRepository
        }
      }

      productRepository ? updateProductRepository(graphParameters) : createProductRepository(graphParameters)
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/products/${productSlug}/repositories/${productRepository?.slug ?? ''}`)
  }

  return (
    <div className='block'>
      <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mr-auto'>
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='bg-edit border-t shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
              {productRepository
                ? format('app.editEntity', { entity: productRepository.name })
                : `${format('app.createNew')} ${format('productRepository.label')}`
              }
            </div>
            <div className='mb-4'>
              <div className='flex flex-col lg:flex-col gap-4'>
                <div className='w-full lg:w-full flex flex-col gap-y-3' data-testid='product-repository-name'>
                  <label className='form-field-wrapper form-field-label'>
                    <p className='required-field'>{format('productRepository.name')}</p>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      placeholder={format('productRepository.name.placeholder')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </label>
                </div>
                <div className='w-full lg:w-full flex flex-col gap-y-3'>
                  <label className='form-field-wrapper form-field-label'>
                    <p>{format('productRepository.aboluteUrl')}</p>
                    <Input
                      {...register('absoluteUrl')}
                      placeholder={format('productRepository.absoluteUrl.placeholder')}
                    />
                  </label>
                </div>
                <div className='w-full lg:w-full flex flex-col gap-y-3'>
                  <label className='form-field-wrapper form-field-label'>
                    <p>{format('productRepository.description')}</p>
                    <Input
                      {...register('description')}
                      placeholder={format('productRepository.description.placeholder')}
                    />
                  </label>
                </div>
                <div className='w-full lg:w-full flex flex-col gap-y-3'>
                  <label
                    className='flex gap-x-2 mb-2 items-center self-start text-dial-sapphire'
                    data-testid='organization-is-mni'
                  >
                    <Checkbox {...register('mainRepository')} />
                    {format('productRepository.mainRepository.label')}
                  </label>
                </div>
              </div>
            </div>
            <div className='font-semibold flex flex-row gap-2 text-sm mt-2'>
              <div className='flex flex-wrap text-xl gap-3'>
                <button
                  className='submit-button'
                  type='submit'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
                >
                  {format('productRepository.submit')}
                  {mutating && <FaSpinner className='spinner ml-3' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('productRepository.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3' />}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RepositoryForm

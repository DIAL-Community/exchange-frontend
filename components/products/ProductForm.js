import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner, FaPlus, FaMinus } from 'react-icons/fa'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import FileUploader from '../shared/FileUploader'
import IconButton from '../shared/IconButton'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { CREATE_PRODUCT } from '../../mutations/product'

const ProductForm = React.memo(({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const [session] = useSession()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()
  const [updateProduct, { data }] = useMutation(CREATE_PRODUCT)

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: product?.name,
      aliases: product?.aliases?.length ? product?.aliases.map(value => ({ value })) : [{ value: '' }],
      website: product?.website,
      description: product?.productDescription?.description
    }
  })

  const slug = product?.slug ?? ''

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])

  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (product) {
      map[product.slug] = product.name
    }

    return map
  }, [product, format])

  useEffect(() => {
    if (!data?.createProduct?.errors.length && data?.createProduct?.product) {
      showToast(
        format('product.submit.success'),
        'success',
        'top-center',
        1000,
        null,
        () => router.push(`/${router.locale}/products/${data.createProduct.product.slug}`)
      )
    } else if (data?.createProduct?.errors.length) {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('product.submit.failure')}</span>
          {data?.createProduct?.errors.map((error, errorIdx) => (
            <span key={errorIdx}>{error}</span>
          ))}
        </div>,
        'error',
        'top-center',
        false
      )
    }
  }, [data, format, router, showToast])

  const doUpsert = async (data) => {
    if (session) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = session.user
      const { name, imageFile, website, description, aliases } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        description
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateProduct({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    let route = '/products'
    if (product) {
      route = `${route}/${product.slug}`
    }

    router.push(route)
  }

  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {product
                  ? format('app.edit-entity', { entity: product.name })
                  : `${format('app.create-new')} ${format('product.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='product-name'>
                    <label className='text-xl text-dial-blue required-field' htmlFor='name'>
                      {format('product.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('product.name')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
                      {format('product.aliases')}
                    </label>
                    {aliases.map((alias, aliasIdx) => (
                      <div key={alias.id} className='flex gap-x-2'>
                        <Input
                          {...register(`aliases.${aliasIdx}.value`)}
                          placeholder={format('product.alias')}
                        />
                        {isLastAlias(aliasIdx) && (
                          <IconButton
                            icon={<FaPlus />}
                            onClick={() => append({ value: '' })}
                          />
                        )}
                        {!isSingleAlias && (
                          <IconButton
                            icon={<FaMinus />}
                            onClick={() => remove(aliasIdx)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='product-website'>
                    <label className='text-xl text-dial-blue' htmlFor='website'>
                      {format('product.website')}
                    </label>
                    <Input
                      {...register('website')}
                      id='website'
                      placeholder={format('product.website')}
                      isInvalid={errors.website}
                    />
                    {errors.website && <ValidationError value={errors.website?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-xl text-dial-blue'>
                      {format('product.imageFile')}
                    </label>
                    <FileUploader {...register('imageFile')} />
                  </div>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='block flex flex-col gap-y-2' data-testid='product-description'>
                    <label className='text-xl text-dial-blue required-field'>
                      {format('product.description')}
                    </label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('product.description')}
                          isInvalid={errors.description}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.description && <ValidationError value={errors.description?.message} />}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap text-xl mt-8 gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
                >
                  {`${format('app.submit')} ${format('product.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3' />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

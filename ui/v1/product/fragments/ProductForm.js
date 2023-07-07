import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import Select from '../../shared/form/Select'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_PRODUCT } from '../../shared/mutation/product'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'
import { generateMaturityOptions } from '../../shared/form/options'
import { PAGINATED_PRODUCTS_QUERY, PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/product'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'

const ProductForm = React.memo(({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = product?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { data: sectorsData, loading: loadingSectors } = useQuery(SECTOR_SEARCH_QUERY, {
    variables: { search: '', locale }
  })

  const sectorOptions = useMemo(
    () =>
      sectorsData?.sectors?.map(({ id, slug, name }) => ({
        label: name,
        value: parseInt(id),
        slug
      })) ?? [],
    [sectorsData]
  )

  const maturityOptions = useMemo(() => generateMaturityOptions(format), [format])

  const [updateProduct, { reset }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{
      query: PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_PRODUCTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { createProduct: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setMutating(false)
        showToast(format('product.submit.success'), 'success', 'top-center', 1000, null, () =>
          router.push(`/${router.locale}${REBRAND_BASE_PATH}/products/${response?.product?.slug}`)
        )
      } else {
        setMutating(false)
        showToast(format('product.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('product.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: product?.name,
      maturity: maturityOptions.find(({ value }) => value === product?.maturity),
      description: product?.productDescription?.description,
      markdownUrl: product?.markdownUrl
    }
  })

  useEffect(
    () =>
      setValue(
        'sector',
        sectorOptions.find(({ slug }) => slug === product?.sector.slug)
      ),
    [sectorOptions, setValue, product?.sector.slug]
  )

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, sector, maturity, imageFile, description, markdownUrl } = data
      const variables = {
        name,
        slug,
        sectorSlug: sector.slug,
        maturity: maturity.value,
        description,
        markdownUrl
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
    router.push(`${REBRAND_BASE_PATH}/products/${slug}`)
  }

  return loadingUserSession || loadingSectors ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='py-4'>
        <div className='flex flex-col gap-y-4'>
          <div className='text-xl font-semibold text-dial-blueberry'>
            {product
              ? format('app.edit-entity', { entity: product.name })
              : `${format('app.create-new')} ${format('product.label')}`}
          </div>
          <div className='flex flex-col gap-y-2' data-testid='product-name'>
            <label className='required-field text-dial-blueberry' htmlFor='name'>
              {format('product.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              className='text-sm'
              placeholder={format('product.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field text-dial-blueberry' htmlFor='product-sector'>
              {format('product.sector')}
            </label>
            <Controller
              name='sector'
              control={control}
              rules={{ required: format('validation.required') }}
              defaultValue={sectorOptions.find(({ slug }) => slug === product?.sector.slug)}
              render={({ field }) => (
                <Select
                  id='product-sector'
                  {...field}
                  isSearch
                  options={sectorOptions}
                  placeholder={format('product.sector')}
                  isInvalid={errors.sector}
                />
              )}
            />
            {errors.sector && <ValidationError value={errors.sector?.message} />}
          </div>
          <div className='flex flex-col gap-y-2' data-testid='product-maturity'>
            <label className='required-field text-dial-blueberry' htmlFor='product-maturity'>
              {format('product.maturity')}
            </label>
            <Controller
              name='maturity'
              control={control}
              rules={{ required: format('validation.required') }}
              render={({ field }) => (
                <Select
                  id='product-maturity'
                  {...field}
                  isSearch
                  options={maturityOptions}
                  placeholder={format('product.maturity')}
                  isInvalid={errors.maturity}
                />
              )}
            />
            {errors.maturity && <ValidationError value={errors.maturity?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='markdown-url'>
              {format('product.markdownUrl')}
            </label>
            <Input {...register('markdownUrl')} id='markdown-url' placeholder={format('product.markdownUrl')} />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire' htmlFor='image-uploader'>
              {format('product.imageFile')}
            </label>
            <FileUploader {...register('imageFile')} id='image-uploader' />
          </div>
          <div className='block flex flex-col gap-y-2' data-testid='product-description'>
            <label className='text-dial-sapphire required-field'>
              {format('product.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  editorId='product-description-editor'
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
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button
              type='submit'
              className='submit-button'
              disabled={mutating || reverting}
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
          {product?.markdownUrl && (
            <div className='text-sm italic text-red-500 -mt-3'>
              {format('product.markdownWarning')}
            </div>
          )}
        </div>
      </div>
    </form>
  ) : (
    <Unauthorized />
  )
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

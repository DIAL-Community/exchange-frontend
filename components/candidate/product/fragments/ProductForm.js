import { memo, useCallback, useContext, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaSpinner, FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { ToastContext } from '../../../../lib/ToastContext'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import Input from '../../../shared/form/Input'
import Select from '../../../shared/form/Select'
import UrlInput from '../../../shared/form/UrlInput'
import ValidationError from '../../../shared/form/ValidationError'
import { handleLoadingQuery, handleQueryError } from '../../../shared/GraphQueryHandler'
import {
  CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_CANDIDATE_PRODUCTS_QUERY
} from '../../../shared/query/candidateProduct'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import { PRODUCT_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY } from '../../../shared/query/extraAttributeDefinition'
import {
  compositeAttributeType,
  selectAttributeType,
  textAttributeType,
  urlAttributeType
} from '../../../extra-attribute-definition/constants'
import { CREATE_CANDIDATE_PRODUCT } from '../../../shared/mutation/candidateProduct'

const CompositeAttribute = ({ errors, control, register, extraAttribute }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { name: attributeName, title, attributeRequired, compositeAttributes } = extraAttribute
  const { fields, append, remove } = useFieldArray({
    control,
    // TODO: Doesn't support dynamic name. https://www.react-hook-form.com/api/usefieldarray/
    // If we need more composite type, we need to copy and paste this section of the code.
    name: attributeName,
    rules: {
      required: attributeRequired ? format('validation.required') : false
    }
  })

  return (
    <div className='flex flex-col gap-y-6' key={attributeName}>
      <div className='text-sm font-medium'>
        {title}
      </div>
      {fields.map((item, index) => (
        <div className='flex flex-col gap-y-6 relative' key={item.id}>
          {compositeAttributes.map(({ name, title, attributeRequired: required, description }) => (
            <div className='flex flex-col gap-y-2' key={`${index}-${name}`}>
              <label
                className={required ? 'required-field' : ''}
                htmlFor={`${attributeName}.${index}.${name}`}
              >
                {title}
              </label>
              <Input
                id={`${attributeName}.${index}.${name}`}
                {...register(`${attributeName}.${index}.${name}`, {
                  required: {
                    value: required,
                    message: format('validation.required')
                  }
                })}
                placeholder={description}
                isInvalid={errors[attributeName]?.[index]?.[name]}
              />
              {errors[attributeName]?.[index]?.[name] &&
                <ValidationError value={errors[attributeName]?.[index]?.[name]?.message} />
              }
            </div>
          ))}
          <div className='absolute top-0 right-0'>
            <button
              type="button"
              className='bg-red-500 text-white px-1 py-1 rounded-md ml-auto'
              onClick={() => remove(index)}
            >
              <FaXmark />
            </button>
          </div>
          <div className='border-t border-dashed' />
        </div>
      ))}
      <div className='flex'>
        <button
          type="button"
          className='bg-dial-meadow text-white px-4 py-2 rounded-md ml-auto'
          onClick={() => append({})}
        >
          Append
        </button>
      </div>
      {errors[attributeName]?.root &&
        <ValidationError value={errors[attributeName].root?.message} />
      }
    </div>
  )
}

const ProductForm = memo(({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = product?.slug ?? ''

  const captchaRef = useRef()
  const [captchaValue, setCaptchaValue] = useState()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const buildCompositeValues = (product) => {
    const defaultValues = {}
    if (product?.extraAttributes) {
      product?.extraAttributes
        .filter(a => a.type === compositeAttributeType)
        .reduce(
          (defaultValues, attribute) => {
            defaultValues[attribute.name] = attribute.value

            return defaultValues
          },
          defaultValues
        )
    }

    return defaultValues
  }

  const resolveValueByFieldKey = (fieldKey) => {
    let defaultValue
    if (product?.extraAttributes) {
      const extraAttribute = product.extraAttributes.find(attribute => attribute.name === fieldKey)
      defaultValue = extraAttribute?.value
    }

    return defaultValue
  }

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    values: {
      name: product?.name ?? '',
      website: product?.website ?? '',
      repository: product?.repository ?? '',
      description: product?.description ?? '',
      submitterEmail: product?.submitterEmail ?? '',
      ...buildCompositeValues(product)
    }
  })

  const { loading, data, error } = useQuery(PRODUCT_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY, {
    context: {
      headers: {
        ...(product ? GRAPH_QUERY_CONTEXT.EDITING : GRAPH_QUERY_CONTEXT.CREATING)
      }
    }
  })

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateProduct, { reset }] = useMutation(CREATE_CANDIDATE_PRODUCT, {
    refetchQueries: [{
      query: CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_CANDIDATE_PRODUCTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { createCandidateProduct: response } = data
      if (response.candidateProduct && response.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}` +
          `/candidate/products/${response.candidateProduct.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.candidateProduct.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateProduct.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.candidateProduct.label') }))
      setMutating(false)
      reset()
    }
  })

  const buildExtraAttributes = (otherFormValues) => {
    const extraAttributes = []
    if (data.productExtraAttributeDefinitions) {
      const attributeDefinitions = data.productExtraAttributeDefinitions

      return attributeDefinitions.map(attributeDefinition => {
        const extraAttribute = {}
        extraAttribute['name'] = attributeDefinition.name
        extraAttribute['value'] = otherFormValues[attributeDefinition.name]
        extraAttribute['type'] = attributeDefinition.attributeType
        extraAttribute['index'] = attributeDefinition.index
        extraAttribute['title'] = attributeDefinition.title
        extraAttribute['description'] = attributeDefinition.description

        return extraAttribute
      })
    }

    return extraAttributes
  }

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const {
      name,
      website,
      repository,
      description,
      submitterEmail,
      ...otherValues
    } = data

    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      name,
      slug,
      website,
      repository,
      description,
      submitterEmail,
      extraAttributes: buildExtraAttributes(otherValues),
      captcha: captchaValue
    }

    updateProduct({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const updateCaptchaData = (value) => {
    setCaptchaValue(value)
  }

  const cancelForm = () => {
    if (product) {
      setReverting(true)
      router.push(`/${locale}/candidate/products/${slug}`)
    }
  }

  // Handle useQuery return values.
  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  }

  // Parse the extra attributes information.
  const { productExtraAttributeDefinitions } = data

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-meadow'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {product
              ? format('app.editEntity', { entity: product.name })
              : `${format('app.createNew')} ${format('ui.product.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('ui.candidateProduct.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('ui.candidateProduct.name.placeholder')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='website'>
              {format('ui.candidateProduct.website')}
            </label>
            <Controller
              id='website'
              name='website'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='website'
                  value={value}
                  onChange={onChange}
                  placeholder={format('ui.candidateProduct.website.placeholder')}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='repository'>
              {format('ui.candidateProduct.repository')}
            </label>
            <Controller
              id='repository'
              name='repository'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput
                  id='repository'
                  value={value}
                  onChange={onChange}
                  placeholder={format('ui.candidateProduct.repository.placeholder')}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('ui.candidateProduct.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('ui.candidateProduct.description.placeholder')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='submitterEmail'>
              {format('ui.candidateProduct.email')}
            </label>
            <Input
              {...register('submitterEmail', { required: format('validation.required') })}
              id='submitterEmail'
              placeholder={format('ui.candidateProduct.email.placeholder')}
              isInvalid={errors.submitterEmail}
            />
            {errors.submitterEmail && <ValidationError value={errors.submitterEmail?.message} />}
          </div>
          <div className='border-t border-dashed' />
          <div className='text-base font-semibold'>
            {format('ui.candidateProduct.extraAttributes')}
          </div>
          {productExtraAttributeDefinitions.map((extraAttribute) => {
            const { name, title, description, attributeType, attributeRequired, multipleChoice, choices } = extraAttribute
            switch (attributeType) {
              case compositeAttributeType:
                return (
                  <CompositeAttribute
                    key={name}
                    errors={errors}
                    control={control}
                    register={register}
                    extraAttribute={extraAttribute}
                  />
                )
              case textAttributeType:
                return (
                  <div className='flex flex-col gap-y-2' key={name}>
                    <label className={attributeRequired ? 'required-field' : ''} htmlFor={name}>
                      {title}
                    </label>
                    <Input
                      id={name}
                      {...register(name, {
                        required: {
                          value: attributeRequired,
                          message: format('validation.required')
                        }
                      })}
                      value={resolveValueByFieldKey(name)}
                      placeholder={description}
                      isInvalid={errors[name]}
                    />
                    {errors[name] && <ValidationError value={errors[name]?.message} />}
                  </div>
                )
              case urlAttributeType:
                return (
                  <div className='flex flex-col gap-y-2' key={name}>
                    <label className={attributeRequired ? 'required-field' : ''} htmlFor={name}>
                      {title}
                    </label>
                    <Controller
                      id={name}
                      name={name}
                      control={control}
                      defaultValue={resolveValueByFieldKey(name) ?? ''}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          id={name}
                          value={value}
                          onChange={onChange}
                          placeholder={description}
                        />
                      )}
                      rules={{
                        required: {
                          value: attributeRequired,
                          message: format('validation.required')
                        }
                      }}
                    />
                    {errors[name] && <ValidationError value={errors[name]?.message} />}
                  </div>
                )
              case selectAttributeType:
                return (
                  <div className='flex flex-col gap-y-2' key={name}>
                    <label className={attributeRequired ? 'required-field' : ''} htmlFor={name}>
                      {title}
                    </label>
                    <Controller
                      id={name}
                      name={name}
                      control={control}
                      defaultValue={resolveValueByFieldKey(name)}
                      rules={{
                        required: {
                          value: attributeRequired,
                          message: format('validation.required')
                        }
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          id={name}
                          value={value}
                          onChange={onChange}
                          placeholder={description}
                          options={choices.map((option) => ({
                            label: option,
                            value: option
                          }))}
                          isMulti={multipleChoice}
                        />
                      )}
                    />
                    {errors[name] && <ValidationError value={errors[name]?.message} />}
                  </div>
                )
              default:
                return null
            }
          })}
          <div className='border-t border-dashed' />
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
            onChange={updateCaptchaData}
            ref={captchaRef}
          />
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button
              type='submit'
              className='submit-button'
              disabled={mutating || reverting || !captchaValue}
            >
              {`${format('app.submit')} ${format('ui.product.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            {product &&
              <button type='button'
                className='cancel-button'
                disabled={mutating || reverting}
                onClick={cancelForm}
              >
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3' />}
              </button>
            }
          </div>
        </div>
      </div>
    </form>
  )
})

ProductForm.displayName = 'ProductForm'

export default ProductForm

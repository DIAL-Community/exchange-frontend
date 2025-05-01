import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaSpinner, FaXmark } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import EditButton from '../../shared/form/EditButton'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import HidableSection from '../../shared/HidableSection'
import { UPDATE_CANDIDATE_PRODUCT_EXTRA_ATTRIBUTES } from '../../shared/mutation/candidateProduct'
import { PRODUCT_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY } from '../../shared/query/extraAttributeDefinition'
import { ObjectType, ProductExtraAttributeNames } from '../../utils/constants'
import { prependUrlWithProtocol } from '../../utils/utilities'
import {
  compositeAttributeType,
  selectAttributeType,
  textAttributeType,
  urlAttributeType
} from '../../extra-attribute-definition/constants'

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

const renderExtraAttributes = (extraAttribute) => {
  const { type, value } = extraAttribute
  if (!value) {
    return (
      <div className='text-sm'>
        <FormattedMessage id='general.na' />
      </div>
    )
  }

  switch (type) {
    case urlAttributeType:
      return (
        <div className='flex text-sm'>
          <a
            className='border-b border-dial-iris-blue line-clamp-1 break-all'
            href={prependUrlWithProtocol(value)}
            target='_blank'
            rel='noreferrer'
          >
            {value}
          </a>
        </div>
      )
    case compositeAttributeType:
      return (
        <div className='text-sm flex flex-col gap-y-3'>
          {extraAttribute.value.map((attributeValue, i) => (
            <div key={`attribute-value-${i}`} className='flex flex-col gap-y-1'>
              {Object.keys(attributeValue).map(key => (
                <div key={`attribute-value-${i}-${key}`} className='text-sm'>
                  {attributeValue[key] ? attributeValue[key] : <FormattedMessage id='general.na' />}
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    case textAttributeType:
      return (
        <div className='text-sm'>
          {extraAttribute.value}
        </div>
      )
    case selectAttributeType:
      return (
        <div className='text-sm'>
          {Array.isArray(extraAttribute.value)
            ? extraAttribute.value.map(e => e.value).join(', ')
            : extraAttribute.value.value
          }
        </div>
      )
    default:
      return null
  }
}

const ProductExtraAttributeDefinitions = ({ product, editingAllowed, editingSection, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [isInEditMode, setIsInEditMode] = useState(false)
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false)

  const { locale } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const { data } = useQuery(PRODUCT_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY, {
    context: {
      headers: {
        ...(product ? GRAPH_QUERY_CONTEXT.EDITING : GRAPH_QUERY_CONTEXT.CREATING)
      }
    }
  })

  const [updateExtraAttributes, { reset }] = useMutation(UPDATE_CANDIDATE_PRODUCT_EXTRA_ATTRIBUTES, {
    onError() {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
      setIsSubmitInProgress(false)
      reset()
    },
    onCompleted: (data) => {
      const { updateCandidateProductExtraAttributes: response } = data
      if (response?.product && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.resource.header') }))
        setIsSubmitInProgress(false)
        setIsInEditMode(false)
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
        setIsSubmitInProgress(false)
        reset()
      }
    }
  })

  const resolveValueByFieldKey = (fieldKey) => {
    let defaultValue
    if (product?.extraAttributes) {
      const extraAttribute = product.extraAttributes.find(attribute => attribute.name === fieldKey)
      defaultValue = extraAttribute?.value
    }

    return defaultValue
  }

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

  const {
    control,
    handleSubmit,
    register,
    formState: { isDirty, errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: true,
    values: buildCompositeValues(product)
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
    setIsSubmitInProgress(true)
    const { ...otherValues } = data
    updateExtraAttributes({
      variables: {
        slug: product.slug,
        extraAttributes: buildExtraAttributes(otherValues)
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onSubmit = () => {
    handleSubmit(doUpsert)()
  }

  const onCancel = () => {
  }

  const buildDisplayBody = () => {
    const candidateExtraAttributes = product.extraAttributes
      ? product.extraAttributes.filter(e => ProductExtraAttributeNames.indexOf(e.name) === -1)
      : []

    return candidateExtraAttributes
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((extraAttribute, index) => (
        <div key={`extra-attribute-${index}`} className='flex flex-col gap-y-1 mb-2'>
          <div className='text-sm font-medium text-dial-meadow'>
            {extraAttribute.title}
          </div>
          <div className='text-xs italic'>
            {extraAttribute.description}
          </div>
          {renderExtraAttributes(extraAttribute)}
        </div>
      ))
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-meadow' ref={headerRef}>
      {format('ui.candidateProduct.extraAttributes')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.candidateProduct.extraAttributes.disclaimer')}
    </div>

  const buildEditBody = () => {
    return (
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            {data?.productExtraAttributeDefinitions.map((extraAttribute) => {
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
          </div>
        </div>
      </form>
    )
  }

  const hidableSection = (
    <HidableSection
      objectKey='attributes'
      objectType={ObjectType.PRODUCT}
      disabled={!editingSection}
      displayed={editingAllowed}
    />
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-row gap-3'>
        {sectionHeader}
        <div className='flex gap-3 ml-auto'>
          {hidableSection}
          {editingAllowed && !isInEditMode &&
            <EditButton onClick={() => setIsInEditMode(true)} />
          }
        </div>
      </div>
      {sectionDisclaimer}
      {isInEditMode
        ? (
          <div className='bg-edit text-sm'>
            {buildEditBody()}
            <div className='px-4 lg:px-6 py-4 flex justify-end gap-3'>
              <button
                type='submit'
                onClick={() => {
                  onSubmit()
                }}
                className='submit-button'
                disabled={!isDirty || isSubmitInProgress}
              >
                {format(`${isSubmitInProgress ? 'app.submitting' : 'app.submit'}`)}
                {isSubmitInProgress && <FaSpinner className='spinner ml-3 inline' />}
              </button>
              <button
                type='button'
                onClick={() => {
                  onCancel()
                  setIsInEditMode(false)
                }}
                className='cancel-button'
                disabled={isSubmitInProgress}
              >
                {format('app.cancel')}
              </button>
            </div>
          </div>
        )
        : buildDisplayBody()
      }
    </div>
  )
}

export default ProductExtraAttributeDefinitions

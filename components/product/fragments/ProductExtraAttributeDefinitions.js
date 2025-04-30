import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaXmark } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import EditableSection from '../../shared/EditableSection'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import HidableSection from '../../shared/HidableSection'
import { UPDATE_CANDIDATE_PRODUCT_EXTRA_ATTRIBUTES } from '../../shared/mutation/candidateProduct'
import { EXTRA_ATTRIBUTE_DEFINITIONS_QUERY } from '../../shared/query/extraAttributeDefinition'
import { ObjectType, ProductExtraAttributeNames } from '../../utils/constants'
import { prependUrlWithProtocol } from '../../utils/utilities'

const MaintainerCompositeAttribute = ({ errors, control, register, extraAttribute }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { title, required, attributes } = extraAttribute
  const { fields, append, remove } = useFieldArray({
    control,
    // TODO: Doesn't support dynamic name. https://www.react-hook-form.com/api/usefieldarray/
    // If we need more composite type, we need to copy and paste this section of the code.
    name: 'maintainers',
    rules: {
      required: required ? format('validation.required') : false
    }
  })

  return (
    <div className='flex flex-col gap-y-6' key={name}>
      <div className='text-sm font-medium'>
        {title}
      </div>
      {fields.map((item, index) => (
        <div className='flex flex-col gap-y-6 relative' key={item.id}>
          {attributes.map(({ name, title, required, description }) => (
            <div className='flex flex-col gap-y-2' key={`${index}-${name}`}>
              <label
                className={required ? 'required-field' : ''}
                htmlFor={`maintainers.${index}.${name}`}
              >
                {title}
              </label>
              <Input
                id={`maintainers.${index}.${name}`}
                {...register(`maintainers.${index}.${name}`, {
                  required: {
                    value: required,
                    message: format('validation.required')
                  }
                })}
                placeholder={description}
                isInvalid={errors[`maintainers.${index}.${name}`]}
              />
              {errors?.maintainers?.[index][name] &&
                <ValidationError value={errors?.maintainers?.[index][name]?.message} />
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
          onClick={() => append({ maintainerName: '', maintainerEmail: '' })}
        >
          Append
        </button>
      </div>
      {errors.maintainers?.root &&
        <ValidationError value={errors.maintainers?.root?.message} />
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
    case 'ui.extraAttributeDefinition.attributeType.url':
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
    case 'composite':
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
    case 'ui.extraAttributeDefinition.attributeType.text':
      return (
        <div className='text-sm'>
          {extraAttribute.value}
        </div>
      )
    case 'ui.extraAttributeDefinition.attributeType.select':
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

  const { locale } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const { data } = useQuery(EXTRA_ATTRIBUTE_DEFINITIONS_QUERY, {
    context: {
      headers: {
        ...(product ? GRAPH_QUERY_CONTEXT.EDITING : GRAPH_QUERY_CONTEXT.CREATING)
      }
    }
  })

  const [updateExtraAttributes, { loading, reset }] = useMutation(UPDATE_CANDIDATE_PRODUCT_EXTRA_ATTRIBUTES, {
    onError() {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateCandidateProductExtraAttributes: response } = data
      if (response?.product && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.resource.header') }))
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
        reset()
      }
    }
  })

  const resolveDefaultValueByFieldKey = (fieldKey) => {
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
    formState: { isDirty, errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      maintainers: resolveDefaultValueByFieldKey('maintainers') ?? []
    }
  })

  const buildExtraAttributes = (otherFormValues) => {
    const extraAttributes = []
    if (data.extraAttributeDefinitions) {
      const attributeDefinitions = data.extraAttributeDefinitions

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
            {data?.extraAttributeDefinitions.map((extraAttribute) => {
              const { name, title, description, attributeType, attributeRequired, multipleChoice, choices } = extraAttribute
              switch (attributeType) {
                case 'composite':
                  return (
                    <MaintainerCompositeAttribute
                      key={name}
                      errors={errors}
                      control={control}
                      register={register}
                      extraAttribute={extraAttribute}
                    />
                  )
                case 'ui.extraAttributeDefinition.attributeType.text':
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
                        defaultValue={resolveDefaultValueByFieldKey(name)}
                        placeholder={description}
                        isInvalid={errors[name]}
                      />
                      {errors[name] && <ValidationError value={errors[name]?.message} />}
                    </div>
                  )
                case 'ui.extraAttributeDefinition.attributeType.url':
                  return (
                    <div className='flex flex-col gap-y-2' key={name}>
                      <label className={attributeRequired ? 'required-field' : ''} htmlFor={name}>
                        {title}
                      </label>
                      <Controller
                        id={name}
                        name={name}
                        control={control}
                        defaultValue={resolveDefaultValueByFieldKey(name) ?? ''}
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
                case 'ui.extraAttributeDefinition.attributeType.select':
                  return (
                    <div className='flex flex-col gap-y-2' key={name}>
                      <label className={attributeRequired ? 'required-field' : ''} htmlFor={name}>
                        {title}
                      </label>
                      <Controller
                        id={name}
                        name={name}
                        control={control}
                        defaultValue={resolveDefaultValueByFieldKey(name)}
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
    <EditableSection
      editingAllowed={editingAllowed}
      hidableSection={hidableSection}
      sectionHeader={sectionHeader}
      sectionDisclaimer={sectionDisclaimer}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={buildDisplayBody()}
      editModeBody={buildEditBody()}
    />
  )
}

export default ProductExtraAttributeDefinitions

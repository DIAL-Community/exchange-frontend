import { memo, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_EXTRA_ATTRIBUTE_DEFINITION } from '../../shared/mutation/extraAttributeDefinition'
import {
  EXTRA_ATTRIBUTE_DEFINITION_PAGINATION_ATTRIBUTES_QUERY, EXTRA_ATTRIBUTE_DEFINITIONS_QUERY,
  PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY
} from '../../shared/query/extraAttributeDefinition'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'
import { compositeAttributeType, selectAttributeType, textAttributeType, urlAttributeType } from '../constants'

const ExtraAttributeDefinitionForm = memo(({ extraAttributeDefinition }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const slug = extraAttributeDefinition?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateExtraAttributeDefinition, { reset }] = useMutation(CREATE_EXTRA_ATTRIBUTE_DEFINITION, {
    refetchQueries: [{
      query: EXTRA_ATTRIBUTE_DEFINITION_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { createExtraAttributeDefinition: response } = data
      if (response.extraAttributeDefinition && response.errors.length === 0) {
        const redirectPath = `/${locale}/extra-attribute-definitions/${response.extraAttributeDefinition.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.extraAttributeDefinition.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.extraAttributeDefinition.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.extraAttributeDefinition.label') }))
      reset()
    }
  })

  const [attributes, setAttributes] = useState(extraAttributeDefinition?.compositeAttributes ?? [])

  const receivedAttributesCallback = (data) => (
    data.extraAttributeDefinitions?.map((attribute) => (
      {
        id: attribute.id,
        slug: attribute.slug,
        name: attribute.name,
        title: attribute.title,
        label: attribute.title
      }
    ))
  )

  const addAttribute = (attribute) => {
    setAttributes([
      ...attributes.filter(({ id }) => id !== attribute.id),
      {
        id: attribute.id,
        slug: attribute.slug,
        name: attribute.name,
        title: attribute.title
      }
    ])
  }

  const removeAttribute = (attribute) => {
    setAttributes([...attributes.filter(({ id }) => id !== attribute.id)])
  }

  const attributeTypes = [{
    label: format(compositeAttributeType),
    value: compositeAttributeType
  }, {
    label: format(selectAttributeType),
    value: selectAttributeType
  }, {
    label: format(textAttributeType),
    value: textAttributeType
  }, {
    label: format(urlAttributeType),
    value: urlAttributeType
  }]

  const { control, handleSubmit, register, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: extraAttributeDefinition?.name,
      title: extraAttributeDefinition?.title,
      description: extraAttributeDefinition?.description,
      attributeType: attributeTypes.find(({ value }) => value === extraAttributeDefinition?.attributeType),
      attributeRequired: extraAttributeDefinition?.attributeRequired,
      attributeChoices: extraAttributeDefinition?.choices,
      multipleChoice: extraAttributeDefinition?.multipleChoice
    }
  })

  const attributeTypeWatcher = watch('attributeType')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributeChoices'
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const {
      name,
      title,
      description,
      attributeType: type,
      attributeRequired,
      attributeChoices,
      multipleChoice
    } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      name,
      slug,
      title,
      description,
      multipleChoice,
      attributeRequired,
      entityTypes: ['PRODUCT'],
      attributeType: type?.value,
      choices: type?.value === selectAttributeType ? attributeChoices : [],
      childExtraAttributeNames: type?.value === compositeAttributeType ? attributes.map(({ name }) => name) : []
    }

    updateExtraAttributeDefinition({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/extra-attribute-definitions/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {extraAttributeDefinition
              ? format('app.editEntity', { entity: extraAttributeDefinition.name })
              : `${format('app.createNew')} ${format('ui.extraAttributeDefinition.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('ui.extraAttributeDefinition.name.label')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('ui.extraAttributeDefinition.name.label')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='react-select-attributeType'>
              {format('ui.extraAttributeDefinition.attributeType.label')}
            </label>
            <Controller
              name='attributeType'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isBorderless
                  options={attributeTypes}
                  placeholder={format('ui.extraAttributeDefinition.attributeType.label')}
                  isInvalid={errors.attributeType}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.attributeType && <ValidationError value={errors.attributeType?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('ui.extraAttributeDefinition.title.label')}
            </label>
            <Input
              {...register('title', { required: format('validation.required') })}
              id='title'
              placeholder={format('ui.extraAttributeDefinition.title.label')}
              isInvalid={errors.title}
            />
            {errors.title && <ValidationError value={errors.title?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='description'>
              {format('ui.extraAttributeDefinition.description.label')}
            </label>
            <Input
              {...register('description', { required: format('validation.required') })}
              id='description'
              placeholder={format('ui.extraAttributeDefinition.description.label')}
              isInvalid={errors.description}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex text-dial-sapphire'>
            <label className='flex gap-x-2 items-center self-start'>
              <Checkbox {...register('attributeRequired')} />
              {format('ui.extraAttributeDefinition.attributeRequired.label')}
            </label>
          </div>
          {attributeTypeWatcher?.value === selectAttributeType && (
            <div className='flex flex-col gap-y-3 text-dial-sapphire'>
              <hr className='border-b border-dial-blue-chalk my-3' />
              <div className='flex flex-row gap-x-2'>
                <div className='text-sm'>
                  {format('ui.extraAttributeDefinition.attributeChoices.label')}
                </div>
                <button
                  type='button'
                  className='bg-dial-iris-blue text-white px-3 py-3 rounded shadow-lg shadow-dial-iris-blue ml-auto'
                  onClick={() => append(
                    '',
                    { focusIndex: fields.length }
                  )}
                >
                  <FaPlus />
                </button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className='flex flex-col gap-y-2'>
                  <label className='required-field sr-only' htmlFor={`attribute-choices-${index}`}>
                    {`${format('ui.extraAttributeDefinition.attributeChoice.label')} - ${index + 1}`}
                  </label>
                  <div className='flex flex-row gap-x-2'>
                    <Input
                      id={`attribute-choices-${index}`}
                      {...register(`attributeChoices.${index}`, { required: format('validation.required') })}
                      placeholder={`${format('ui.extraAttributeDefinition.attributeChoice.label')} - ${index + 1}`}
                      isInvalid={errors.description}
                    />
                    {errors.attributeChoices?.[index]
                      && <ValidationError value={errors.attributeChoices?.[index]?.message} />
                    }
                    <button
                      type='button'
                      className='bg-red-500 text-white px-3 rounded shadow-lg shadow-red-300'
                      onClick={() => remove(index)}
                    >
                      <FaMinus />
                    </button>
                  </div>
                </div>
              ))}
              <div className='flex text-dial-sapphire pt-3'>
                <label className='flex gap-x-2 items-center self-start'>
                  <Checkbox {...register('multipleChoice')} />
                  {format('ui.extraAttributeDefinition.multipleChoice.label')}
                </label>
              </div>
            </div>
          )}
          {attributeTypeWatcher?.value === compositeAttributeType && (
            <div className='flex flex-col gap-y-2'>
              <label className='text-dial-sapphire' htmlFor='react-select-attributes'>
                {format('ui.extraAttributeDefinition.header')}
              </label>
              <Controller
                name='attributes'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    async
                    isSearch
                    isBorderless
                    loadOptions={(input) =>
                      fetchSelectOptions(client, input, EXTRA_ATTRIBUTE_DEFINITIONS_QUERY, receivedAttributesCallback)
                    }
                    placeholder={format('ui.extraAttributeDefinition.label')}
                    onChange={addAttribute}
                    value={null}
                  />
                )}
              />
              <div className='flex flex-wrap gap-3'>
                {attributes.map((attribute, attributeIdx) => (
                  <Pill
                    key={`attributes-${attributeIdx}`}
                    label={attribute.title}
                    onRemove={() => removeAttribute(attribute)}
                  />
                ))}
              </div>
            </div>
          )}
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.extraAttributeDefinition.label')}`}
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
      </div>
    </form>
  )
})

ExtraAttributeDefinitionForm.displayName = 'ExtraAttributeDefinitionForm'

export default ExtraAttributeDefinitionForm

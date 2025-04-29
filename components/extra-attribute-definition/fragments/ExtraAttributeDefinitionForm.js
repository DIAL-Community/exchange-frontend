import { memo, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_EXTRA_ATTRIBUTE_DEFINITION } from '../../shared/mutation/extraAttributeDefinition'
import {
  EXTRA_ATTRIBUTE_DEFINITION_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY
} from '../../shared/query/extraAttributeDefinition'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const ExtraAttributeDefinitionForm = memo(({ extraAttributeDefinition }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: extraAttributeDefinition?.name,
      title: extraAttributeDefinition?.title,
      description: extraAttributeDefinition?.description,
      attributeType: extraAttributeDefinition?.attributeType
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const { name, title, description, attributeType } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      name,
      slug,
      title,
      description,
      entityTypes: ['PRODUCT'],
      attributeType,
      attributeRequired: false
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
    router.push(`/${locale}/extraAttributeDefinitions/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {extraAttributeDefinition
              ? format('app.editEntity', { entity: extraAttributeDefinition.name })
              : `${format('app.createNew')} ${format('extraAttributeDefinition.label')}`}
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
            <label className='text-dial-sapphire required-field' htmlFor='attributeType'>
              {format('ui.extraAttributeDefinition.attributeType.label')}
            </label>
            <Input
              {...register('attributeType', { required: format('validation.required') })}
              id='attributeType'
              placeholder={format('ui.extraAttributeDefinition.attributeType.label')}
              isInvalid={errors.attributeType}
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
              placeholder={format('ui.extraAttributeDefinition.type.label')}
              isInvalid={errors.description}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
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

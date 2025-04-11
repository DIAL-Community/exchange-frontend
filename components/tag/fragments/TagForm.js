import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_TAG } from '../../shared/mutation/tag'
import { PAGINATED_TAGS_QUERY, TAG_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/tag'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const TagForm = React.memo(({ tag }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = tag?.slug ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateTag, { reset }] = useMutation(CREATE_TAG, {
    refetchQueries: [{
      query: TAG_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_TAGS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      if (data.createTag.tag && data.createTag.errors.length === 0) {
        const redirectPath = `/${locale}/tags/${data.createTag.tag.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.tag.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.tag.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.tag.label') }))
      setMutating(false)
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: tag?.name,
      description: tag?.tagDescription?.description
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const {
      name,
      description
    } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      name,
      slug,
      description
    }
    updateTag({
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
    router.push(`/${locale}/tags/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {tag
              ? format('app.editEntity', { entity: tag.name })
              : `${format('app.createNew')} ${format('ui.tag.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('tag.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('tag.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='text-dial-sapphire required-field'>
              {format('tag.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('tag.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.tag.label')}`}
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

TagForm.displayName = 'TagForm'

export default TagForm

import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_RUBRIC_CATEGORY } from '../../shared/mutation/rubricCategory'

const RubricCategoryForm = React.memo(({ rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = rubricCategory?.slug ?? ''

  const router = useRouter()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = router

  const [updateRubricCategory, { reset }] = useMutation(CREATE_RUBRIC_CATEGORY, {
    onCompleted: (data) => {
      const { createRubricCategory: response } = data
      if (response?.rubricCategory && response?.errors?.length === 0) {
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.rubricCategory.label') }),
          () => router.push(`/${router.locale}/rubric-categories/${response?.rubricCategory?.slug}`)
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.rubricCategory.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.rubricCategory.label') }))
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: rubricCategory?.name,
      weight: rubricCategory?.weight,
      description: rubricCategory?.rubricCategoryDescription?.description
    }
  })

  const doUpsert = async (data) => {
    setMutating(true)
    const { name, description } = data
    const weight = parseFloat(data.weight)

    const variables = {
      name,
      slug,
      weight,
      description
    }

    updateRubricCategory({
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
    router.push(`/rubric-categories/${rubricCategory?.slug ?? ''}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {rubricCategory
              ? format('app.editEntity', { entity: rubricCategory.name })
              : `${format('app.createNew')} ${format('ui.rubricCategory.label')}`
            }
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('app.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('app.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='weight'>
              {format('ui.rubricCategory.weight')}
            </label>
            <Input
              {...register('weight', { required: format('validation.required') })}
              id='weight'
              type='number'
              step='0.1'
              placeholder={format('ui.rubricCategory.weight')}
              isInvalid={errors.weight}
            />
            {errors.weight && <ValidationError value={errors.weight?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='text-dial-sapphire required-field'>
              {format('app.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('app.description')}
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
              {`${format('app.submit')} ${format('ui.rubricCategory.label')}`}
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

RubricCategoryForm.displayName = 'RubricCategoryForm'

export default RubricCategoryForm

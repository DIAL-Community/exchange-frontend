import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { useUser } from '../../lib/hooks'
import { CREATE_RUBRIC_CATEGORY } from '../../mutations/rubric-category'

const RubricCategoryForm = React.memo(({ rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = rubricCategory?.slug ?? ''

  const router = useRouter()
  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const { locale } = router

  const [updateRubricCategory, { reset }] = useMutation(CREATE_RUBRIC_CATEGORY, {
    onCompleted: (data) => {
      const { createRubricCategory: response } = data
      if (response?.rubricCategory && response?.errors?.length === 0) {
        setMutating(false)
        showToast(
          format('toast.rubric-category.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`/${router.locale}/rubric_categories/${response?.rubricCategory?.slug}`)
        )
      } else {
        setMutating(false)
        showToast(format('toast.rubric-category.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('toast.rubric-category.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
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

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (rubricCategory) {
      map[rubricCategory.slug] = rubricCategory.name
    }

    return map
  }, [rubricCategory, format])

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
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
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/rubric_categories/${rubricCategory?.slug ?? ''}`)
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
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {rubricCategory
                  ? format('app.editEntity', { entity: rubricCategory.name })
                  : `${format('app.createNew')} ${format('rubric-category.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='rubric-category-name'>
                    <label className='form-field-label required-field' htmlFor='name'>
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
                  <div className='form-field-wrapper' data-testid='rubric-category-weight'>
                    <label className='form-field-label required-field' htmlFor='weight'>
                      {format('rubric-category.weight')}
                    </label>
                    <Input
                      {...register('weight', { required: format('validation.required') })}
                      id='weight'
                      type='number'
                      step='0.1'
                      placeholder={format('rubric-category.weight')}
                      isInvalid={errors.weight}
                    />
                    {errors.weight && <ValidationError value={errors.weight?.message} />}
                  </div>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='block flex flex-col gap-y-2' data-testid='rubric-category-description'>
                    <label className='form-field-label required-field'>
                      {format('app.description')}
                    </label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('app.description')}
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
                  {`${format('app.submit')} ${format('rubric-category.label')}`}
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

RubricCategoryForm.displayName = 'RubricCategoryForm'

export default RubricCategoryForm

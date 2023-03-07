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
import { getCategoryIndicatorTypes } from '../../lib/utilities'
import Select from '../shared/Select'
import { CREATE_CATEGORY_INDICATOR } from '../../mutations/category-indicator'

const CategoryIndicatorForm = ({ rubricCategory, categoryIndicator }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const slug = categoryIndicator?.slug ?? ''

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const categoryIndicatorTypes = getCategoryIndicatorTypes(format)

  const [updateCategoryIndicator, { reset }] = useMutation(CREATE_CATEGORY_INDICATOR, {
    onCompleted: (data) => {
      const { createCategoryIndicator: response } = data
      if (response?.categoryIndicator && response?.errors?.length === 0) {
        setMutating(false)
        showToast(
          format('toast.category-indicator.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(
            `/${locale}` +
            `/rubric_categories/${rubricCategory.slug}` +
            `/${data.createCategoryIndicator.categoryIndicator.slug}`
          )
        )
      } else {
        setMutating(false)
        showToast(format('toast.category-indicator.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('toast.category-indicator.submit.failure')}</span>
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
      name: categoryIndicator?.name,
      weight: categoryIndicator?.weight,
      indicatorType: categoryIndicatorTypes.find(
        ({ value: indicatorType }) => indicatorType === categoryIndicator?.indicatorType
      ),
      dataSource: categoryIndicator?.dataSource,
      scriptName: categoryIndicator?.scriptName,
      description: categoryIndicator?.categoryIndicatorDescription?.description
    }
  })

  const slugNameMapping = useMemo(() => {
    const map = {
      create_category_indicator: format('categoryIndicator.create'),
      edit: format('app.edit')
    }

    if (rubricCategory) {
      map[rubricCategory.slug] = rubricCategory.name
    }

    if (categoryIndicator) {
      map[categoryIndicator.slug] = categoryIndicator.name
    }

    return map
  }, [categoryIndicator, rubricCategory, format])

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, description, dataSource, scriptName, indicatorType } = data
      const weight = parseFloat(data.weight)
      const rubricCategorySlug = rubricCategory?.slug

      const variables = {
        name,
        slug,
        rubricCategorySlug,
        indicatorType: indicatorType.value,
        weight,
        dataSource,
        scriptName,
        description
      }

      updateCategoryIndicator({
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

    router.push(`/rubric_categories/${rubricCategory?.slug}/${categoryIndicator?.slug ?? ''}`)
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
                {categoryIndicator
                  ? format('app.edit-entity', { entity: categoryIndicator.name })
                  : `${format('app.create-new')} ${format('categoryIndicator.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='category-indicator-name'>
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
                  <div className='form-field-wrapper' data-testid='category-indicator-indicator-type'>
                    <label className='form-field-label required-field'>
                      {format('categoryIndicator.indicatorType')}
                    </label>
                    <Controller
                      name='indicatorType'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isSearch
                          options={categoryIndicatorTypes}
                          placeholder={format('categoryIndicator.indicatorType')}
                          isInvalid={errors.indicatorType}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.indicatorType && <ValidationError value={errors.indicatorType?.message} />}
                  </div>
                  <div className='form-field-wrapper' data-testid='category-indicator-weight'>
                    <label className='form-field-label required-field' htmlFor='weight'>
                      {format('categoryIndicator.weight')}
                    </label>
                    <Input
                      {...register('weight', { required: format('validation.required') })}
                      id='weight'
                      type='number'
                      step='0.001'
                      placeholder={format('categoryIndicator.weight')}
                      isInvalid={errors.weight}
                    />
                    {errors.weight && <ValidationError value={errors.weight?.message} />}
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('categoryIndicator.dataSource')}
                    </label>
                    <Input {...register('dataSource')} placeholder={format('categoryIndicator.dataSource')} />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('categoryIndicator.scriptName')}
                    </label>
                    <Input {...register('scriptName')} placeholder={format('categoryIndicator.scriptName')} />
                  </div>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='flex flex-col gap-y-2' data-testid='category-indicator-description'>
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
                  {`${format('app.submit')} ${format('categoryIndicator.label')}`}
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
}

CategoryIndicatorForm.displayName = 'CategoryIndicatorForm'

export default CategoryIndicatorForm

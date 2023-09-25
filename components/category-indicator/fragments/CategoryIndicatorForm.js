import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import { useUser } from '../../../lib/hooks'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import ValidationError from '../../shared/form/ValidationError'
import { ToastContext } from '../../../lib/ToastContext'
import { generateCategoryIndicatorTypes } from '../../shared/form/options'
import { CREATE_CATEGORY_INDICATOR } from '../../shared/mutation/categoryIndicator'

const CategoryIndicatorForm = ({ rubricCategory, categoryIndicator }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const slug = categoryIndicator?.slug ?? ''

  const router = useRouter()
  const { locale } = router

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const categoryIndicatorTypes = generateCategoryIndicatorTypes(format)

  const [updateCategoryIndicator, { reset }] = useMutation(CREATE_CATEGORY_INDICATOR, {
    onCompleted: (data) => {
      const { createCategoryIndicator: response } = data
      if (response?.categoryIndicator && response?.errors?.length === 0) {
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('categoryIndicator.label') }),
          () => router.push(
            `/${locale}` +
            `/rubric-categories/${rubricCategory.slug}` +
            `/category-indicators/${response.categoryIndicator.slug}`
          )
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('categoryIndicator.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('categoryIndicator.label') }))
      setMutating(false)
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

    router.push(
      `/rubric-categories/${rubricCategory?.slug}`+
      `/category-indicators/${categoryIndicator?.slug ?? ''}`
    )
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {categoryIndicator
                  ? format('app.editEntity', { entity: categoryIndicator.name })
                  : `${format('app.createNew')} ${format('categoryIndicator.label')}`
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
                <label className='text-dial-sapphire required-field'>
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
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='weight'>
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
                <label className='text-dial-sapphire '>
                  {format('categoryIndicator.dataSource')}
                </label>
                <Input {...register('dataSource')} placeholder={format('categoryIndicator.dataSource')} />
              </div>
              <div className='form-field-wrapper'>
                <label className='text-dial-sapphire '>
                  {format('categoryIndicator.scriptName')}
                </label>
                <Input {...register('scriptName')} placeholder={format('categoryIndicator.scriptName')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field'>
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
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
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
          </div>
        </form>
      )
      : <Unauthorized />
}

CategoryIndicatorForm.displayName = 'CategoryIndicatorForm'

export default CategoryIndicatorForm

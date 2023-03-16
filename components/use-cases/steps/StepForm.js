import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import Breadcrumb from '../../shared/breadcrumb'
import { HtmlEditor } from '../../shared/HtmlEditor'
import Input from '../../shared/Input'
import { ToastContext } from '../../../lib/ToastContext'
import ValidationError from '../../shared/ValidationError'
import { CREATE_USE_CASE_STEP } from '../../../mutations/use-case'
import { useUser } from '../../../lib/hooks'
import { Loading, Unauthorized } from '../../shared/FetchStatus'

const StepForm = React.memo(({ useCaseStep, useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { user, isAdminUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()

  const [updateUseCaseStep, { reset }] = useMutation(CREATE_USE_CASE_STEP, {
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('use-case-step.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center',
        1000
      )
      reset()
    },
    onCompleted: (data) => {
      const { createUseCaseStep: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setMutating(false)
        showToast(
          format('use-case-step.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(
            `/${router.locale}` +
            `/use_cases/${data.createUseCaseStep.useCaseStep.useCase.slug}` +
            `/use_case_steps/${data.createUseCaseStep.useCaseStep.slug}`
          )
        )
      } else {
        setMutating(false)
        showToast(format('use-case-step.submit.failure'), 'error', 'top-center', 1000)
        reset()
      }
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: useCaseStep?.name,
      stepNumber: useCaseStep?.stepNumber,
      description: useCaseStep?.useCaseStepDescription?.description,
      markdownUrl: useCaseStep?.markdownUrl,
    }
  })

  const slug = useCaseStep?.slug ?? ''
  const useCaseId = parseInt(slug ? useCaseStep?.useCase.id : useCase?.id)

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (useCaseStep) {
      map[useCaseStep.slug] = useCaseStep.name
      map[useCaseStep.useCase.slug] = useCaseStep.useCase.name
    }

    if (useCase) {
      map[useCase.slug] = useCase.name
    }

    return map
  }, [useCaseStep, useCase, format])

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const stepNumber = parseInt(data.stepNumber)

      const { userEmail, userToken } = user

      const { name, description, markdownUrl } = data

      const variables = {
        name,
        slug,
        stepNumber,
        description,
        useCaseId,
        markdownUrl
      }
      updateUseCaseStep({
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
    router.push(`/use_cases/${useCase?.slug}/${slug && 'use_case_steps/' + slug}`)
  }

  return (
    loadingUserSession  ? <Loading /> : isAdminUser ? (
      <div className='flex flex-col'>
        <div className='hidden lg:block px-8'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='pb-8 px-8'>
          <div id='content' className='sm:px-0 max-w-full mx-auto'>
            <form onSubmit={handleSubmit(doUpsert)}>
              <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
                <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                  {useCaseStep?.slug
                    ? format('app.edit-entity', { entity: useCaseStep?.name })
                    : `${format('app.create-new')} ${format('use-case-step.label')}`
                  }
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                    <div className='form-field-wrapper' data-testid='use-case-step-name'>
                      <label className='form-field-label required-field' htmlFor='name'>
                        {format('use-case-step.name')}
                      </label>
                      <Input
                        {...register('name', { required: format('validation.required') })}
                        id='name'
                        placeholder={format('use-case-step.name')}
                        isInvalid={errors.name}
                      />
                      {errors.name && <ValidationError value={errors.name?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='use-case-step-step-number'>
                      <label className='form-field-label required-field' htmlFor='stepNumber'>
                        {format('use-case-step.step-number')}
                      </label>
                      <Input
                        type='number'
                        {...register('stepNumber', { required: format('validation.required') })}
                        id='stepNumber'
                        placeholder={format('use-case-step.step-number')}
                        isInvalid={errors.stepNumber}
                      />
                      {errors.stepNumber && <ValidationError value={errors.stepNumber?.message} />}
                    </div>
                    <div className='form-field-wrapper' data-testid='use-case-step-markdown-url'>
                      <label className='form-field-label required-field' htmlFor='markdownUrl'>
                        {format('use-case-step.markdownUrl')}
                      </label>
                      <Input
                        {...register('markdownUrl')}
                        id='markdownUrl'
                        placeholder={format('use-case-step.markdownUrl')}
                      />
                    </div>
                  </div>
                  {
                    !useCaseStep?.markdownUrl &&
                      <div className='w-full lg:w-1/2'>
                        <div className='block flex flex-col gap-y-2' data-testid='use-case-step-description'>
                          <label className='form-field-label required-field'>
                            {format('use-case-step.description')}
                          </label>
                          <Controller
                            name='description'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <HtmlEditor
                                editorId='description-editor'
                                onChange={onChange}
                                initialContent={value}
                                placeholder={format('use-case-step.description')}
                                isInvalid={errors.description}
                              />
                            )}
                            rules={{ required: format('validation.required') }}
                          />
                          {errors.description && <ValidationError value={errors.description?.message} />}
                        </div>
                      </div>
                  }
                </div>
                <div className='flex flex-wrap text-xl mt-8 gap-3'>
                  <button
                    type='submit'
                    className='submit-button'
                    disabled={mutating || reverting}
                    data-testid='submit-button'
                  >
                    {`${format('app.submit')} ${format('use-case-step.label')}`}
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
    ) : <Unauthorized />
  )
})

StepForm.displayName = 'StepForm'

export default StepForm

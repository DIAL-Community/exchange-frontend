import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { useUser } from '../../../../../lib/hooks'
import { ToastContext } from '../../../../../lib/ToastContext'
import { CREATE_USE_CASE_STEP } from '../../../../../mutations/use-case'
import ValidationError from '../../../shared/form/ValidationError'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import Input from '../../../shared/form/Input'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { REBRAND_BASE_PATH } from '../../../utils/constants'

const UseCaseStepForm = React.memo(({ useCaseStep, useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()
  const canEdit = (isAdminUser || isEditorUser)

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
            `/${router.locale}${REBRAND_BASE_PATH}` +
            `/use-cases/${data.createUseCaseStep.useCaseStep.useCase.slug}` +
            `/use-case-steps/${data.createUseCaseStep.useCaseStep.slug}`
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
    }
  })

  const slug = useCaseStep?.slug ?? ''
  const useCaseId = parseInt(useCase?.id)

  const doUpsert = async (data) => {
    if (canEdit) {
      setMutating(true)

      const stepNumber = parseInt(data.stepNumber)

      const { userEmail, userToken } = user
      const { name, description } = data

      const variables = {
        name,
        slug,
        stepNumber,
        description,
        useCaseId
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
    router.push(`${REBRAND_BASE_PATH}/use-cases/${useCase?.slug}/${slug && 'use-case-steps/' + slug}`)
  }

  return (
    loadingUserSession  ? <Loading /> : canEdit ? (
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='py-8'>
          <div className='flex flex-col gap-y-4'>
            <div className='text-2xl font-semibold text-dial-sapphire'>
              {useCaseStep?.slug
                ? format('app.editEntity', { entity: useCaseStep?.name })
                : `${format('app.createNew')} ${format('use-case-step.label')}`
              }
            </div>
            <div className='form-field-wrapper'>
              <label className='required-field text-dial-blueberry' htmlFor='name'>
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
            <div className='form-field-wrapper'>
              <label className='required-field text-dial-blueberry' htmlFor='stepNumber'>
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
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field text-dial-blueberry'>
                {format('use-case-step.description')}
              </label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='use-case-step-description-editor'
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
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button
                type='submit'
                className='submit-button'
                disabled={mutating || reverting}
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
            { useCase.markdownUrl &&
              <div className='text-sm italic text-red-500 -mt-3'>
                {format('useCaseStep.markdownWarning')}
              </div>
            }
          </div>
        </div>
      </form>
    ) : <Unauthorized />
  )
})

UseCaseStepForm.displayName = 'UseCaseStepForm'

export default UseCaseStepForm

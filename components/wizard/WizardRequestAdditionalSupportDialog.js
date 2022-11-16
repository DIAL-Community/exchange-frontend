import { useMutation } from '@apollo/client'
import { useCallback, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { validate } from 'email-validator'
import { ToastContext } from '../../lib/ToastContext'
import Dialog from '../shared/Dialog'
import Input from '../shared/Input'
import ValidationError from '../shared/ValidationError'
import Textarea from '../shared/Textarea'
import { CREATE_WIZARD_GUIDANCE_MAIL } from '../../mutations/wizard'

const MESSAGE_MIN_LENGTH = 20
const MESSAGE_MAX_LENGTH = 1000
const TEXTAREA_DEFAULT_ROWS = 6

const WizardRequestAdditionalSupportDialog = ({ isOpen, onClose }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const [createWizardGuidanceMail, { called: isSubmitInProgress, reset }] = useMutation(CREATE_WIZARD_GUIDANCE_MAIL, {
    onCompleted: (data) => {
      showToast(data?.createWizardGuidanceMail?.response, 'success', 'top-center')
      onClose()
      reset()
    },
    onError: (data) => {
      showToast(data?.createWizardGuidanceMail?.response, 'error', 'top-center')
      onClose()
      reset()
    }
  })

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onChange',
    shouldUnregister: true
  })

  const doUpsert = async ({ name, emailAddress, message }) => createWizardGuidanceMail({ variables: { name, emailAddress, message } })

  return (
    <Dialog
      submitButton
      cancelButton
      isOpen={isOpen}
      onClose={onClose}
      formId='wizard-request-additional-support-form'
      isSubmitInProgress={isSubmitInProgress}
    >
      <div className='w-full'>
        <form onSubmit={handleSubmit(doUpsert)} id='wizard-request-additional-support-form'>
          <div className='pb-12 mb-4 flex flex-col gap-3'>
            <div className='text-2xl font-bold text-dial-blue pb-4'>
              {format('wizard.request-additional-support')}
            </div>
            <div className='form-field-wrapper' data-testid='name'>
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
            <div className='form-field-wrapper' data-testid='email-address'>
              <label className='form-field-label required-field' htmlFor='email-address'>
                {format('app.email')}
              </label>
              <Input
                {...register('emailAddress',
                  {
                    required: format('validation.required'),
                    validate: value => validate(value) || format('validation.email')
                  }
                )}
                id='email-address'
                placeholder={format('app.email')}
                isInvalid={errors.emailAddress}
              />
              {errors.emailAddress && <ValidationError value={errors.emailAddress?.message} />}
            </div>
            <div className='form-field-wrapper' data-testid='message'>
              <label className='form-field-label required-field' htmlFor='message'>
                {format('wizard.request-additional-support.message')}
              </label>
              <Textarea
                {...register('message',
                  {
                    required: format('validation.required'),
                    minLength: { value: MESSAGE_MIN_LENGTH, message: format('validation.min-length', { minLength: MESSAGE_MIN_LENGTH }) },
                    maxLength: { value: MESSAGE_MAX_LENGTH, message: format('validation.max-length', { maxLength: MESSAGE_MAX_LENGTH }) }
                  }
                )}
                id='message'
                placeholder={format('wizard.request-additional-support.message')}
                isInvalid={errors.message}
                rows={TEXTAREA_DEFAULT_ROWS}
              />
              {errors.message && <ValidationError value={errors.message?.message} />}
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default WizardRequestAdditionalSupportDialog

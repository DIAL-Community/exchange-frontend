import { useMutation } from '@apollo/client'
import { useCallback, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { validate } from 'email-validator'
import { ToastContext } from '../../../../lib/ToastContext'
import Dialog from '../../shared/form/Dialog'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import TextArea from '../../shared/form/TextArea'
import { CREATE_WIZARD_GUIDANCE_MAIL } from '../../shared/mutation/wizard'

const MESSAGE_MIN_LENGTH = 20
const MESSAGE_MAX_LENGTH = 1000
const TEXTAREA_DEFAULT_ROWS = 6

const WizardSupportDialog = ({ isOpen, onClose }) => {
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

  const doUpsert = async ({ name, emailAddress, message }) =>
    createWizardGuidanceMail({ variables: { name, emailAddress, message } })

  return (
    <Dialog
      submitButton
      cancelButton
      isOpen={isOpen}
      onClose={onClose}
      formId='additional-support-form'
      isSubmitInProgress={isSubmitInProgress}
    >
      <div className='w-full'>
        <form onSubmit={handleSubmit(doUpsert)} id='additional-support-form'>
          <div className='pb-12 mb-4 flex flex-col gap-3 text-sm'>
            <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
              {format('wizard.additionalSupport')}
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
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
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='email-address'>
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
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='message'>
                {format('wizard.additionalSupport.message')}
              </label>
              <TextArea
                {...register('message',
                  {
                    required: format('validation.required'),
                    minLength: {
                      value: MESSAGE_MIN_LENGTH,
                      message: format(
                        'validation.min-length',
                        { minLength: MESSAGE_MIN_LENGTH }
                      )
                    },
                    maxLength: {
                      value: MESSAGE_MAX_LENGTH,
                      message: format(
                        'validation.max-length',
                        { maxLength: MESSAGE_MAX_LENGTH }
                      )
                    }
                  }
                )}
                id='message'
                placeholder={format('wizard.additionalSupport.message')}
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

export default WizardSupportDialog

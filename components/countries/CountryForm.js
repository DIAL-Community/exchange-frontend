import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import Input from '../shared/Input'
import ValidationError from '../shared/ValidationError'
import Dialog, { DialogType } from '../shared/Dialog'
import { CREATE_COUNTRY } from '../../mutations/country'

const CountryForm = ({ isOpen, onClose, country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { data: session } = useSession()

  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [updateCountry, { called: isSubmitInProgress, reset }] = useMutation(CREATE_COUNTRY, {
    refetchQueries: ['SearchCountries'],
    onCompleted: (data) => {
      if (data.createCountry.country) {
        showToast(format('toast.country.submit.success'), 'success', 'top-center')
        onClose(true)
        reset()
      }
      else {
        showToast(
          <div className='flex flex-col'>
            <span>{format('toast.country.submit.failure')}</span>
          </div>,
          'error',
          'top-center'
        )
        reset()
      }

    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{format('toast.country.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: { name: country?.name }
  })

  const slug = country?.slug ?? ''

  const doUpsert = async (data) => {
    if (session) {
      const { userEmail, userToken } = session.user
      const { name } = data

      updateCountry({
        variables: { name, slug },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  return (
    <Dialog
      submitButton
      cancelButton
      isOpen={isOpen}
      onClose={onClose}
      formId='country-form'
      isSubmitInProgress={isSubmitInProgress}
      dialogType={DialogType.FORM}
    >
      <div className='w-full'>
        <form onSubmit={handleSubmit(doUpsert)} id='country-form'>
          <div className='pb-12 mb-4 flex flex-col gap-3'>
            <div className='text-2xl font-bold text-dial-blue pb-4'>
              {country
                ? format('app.edit-entity', { entity: country.name })
                : `${format('app.create-new')} ${format('country.label')}`
              }
            </div>
            <div className='flex flex-col gap-y-2 mb-2' data-testid='country-name'>
              <label className='text-xl text-dial-blue required-field' htmlFor='name'>
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
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default CountryForm

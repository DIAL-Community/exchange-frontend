import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_COUNTRY } from '../../shared/mutation/country'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { COUNTRY_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_COUNTRIES_QUERY } from '../../shared/query/country'

const CountryForm = React.memo(({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = country?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateCountry, { reset }] = useMutation(CREATE_COUNTRY, {
    refetchQueries: [{
      query: COUNTRY_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_COUNTRIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createCountry.country && data.createCountry.errors.length === 0) {
        const redirectPath = `/${locale}/countries/${data.createCountry.country.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.country.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.country.submit.failure', { entity: format('ui.country.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.country.submit.failure', { entity: format('ui.country.label') }))
      reset()
    }
  })

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: { name: country?.name }
  })

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
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

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/countries/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {country
                  ? format('app.editEntity', { entity: country.name })
                  : `${format('app.createNew')} ${format('ui.country.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
                  {format('ui.country.label')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.country.label')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.country.label')}`}
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
})

CountryForm.displayName = 'CountryForm'

export default CountryForm

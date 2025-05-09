import { memo, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_COUNTRY } from '../../shared/mutation/country'
import { COUNTRY_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_COUNTRIES_QUERY } from '../../shared/query/country'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const CountryForm = memo(({ country, setEditing }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = country?.slug ?? ''
  const name = country?.name ?? ''

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateCountry, { reset }] = useMutation(CREATE_COUNTRY, {
    refetchQueries: [{
      query: COUNTRY_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_COUNTRIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      if (data.createCountry.country && data.createCountry.errors.length === 0) {
        setEditing(false)
        setMutating(false)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.country.label') }))
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

  const { handleSubmit, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      description: country?.description
    }
  })

  const doUpsert = async (data) => {
    const { description } = data
    updateCountry({
      variables: { name, slug, description },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setEditing(false)
    setReverting(true)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {country
              ? format('app.editEntity', { entity: country.name })
              : `${format('app.createNew')} ${format('ui.country.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='text-dial-sapphire required-field'>
              {format('country.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('country.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
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
})

CountryForm.displayName = 'CountryForm'

export default CountryForm

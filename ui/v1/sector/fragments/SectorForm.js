import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_SECTOR } from '../../shared/mutation/sector'
import Checkbox from '../../shared/form/Checkbox'
import Select from '../../shared/form/Select'
import { generateLanguageOptions } from '../../shared/form/options'

const SectorForm = React.memo(({ sector }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = sector?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const localeOptions = useMemo(() => generateLanguageOptions(format), [format])
  const sectorLocale = useMemo(
    () => sector && localeOptions.find(
      ({ value }) => value === sector.locale
    ),
    [sector, localeOptions]
  )

  const [updateSector, { reset }] = useMutation(CREATE_SECTOR, {
    onCompleted: (data) => {
      if (data.createSector.sector && data.createSector.errors.length === 0) {
        const redirectPath = `/${locale}/sectors/${data.createSector.sector.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.sector.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sector.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sector.label') }))
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: sector?.name,
      locale: sectorLocale,
      isDisplayable: sector?.isDisplayable
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
      const { name, locale, isDisplayable } = data
      const variables = {
        name,
        slug,
        locale: locale.value,
        isDisplayable
      }

      updateSector({
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
    router.push(`/${locale}/sectors/${slug}`)
  }

  return loadingUserSession ? (
    <Loading />
  ) : isAdminUser || isEditorUser ? (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {sector
              ? format('app.editEntity', { entity: sector.name })
              : `${format('app.createNew')} ${format('ui.sector.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='text-dial-sapphire required-field' htmlFor='name'>
              {format('sector.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('sector.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2 mb-2' data-testid='sector-locale'>
            <label className='text-dial-sapphire required-field' htmlFor='locale'>
              {format('locale.label')}
            </label>
            <Controller
              name='locale'
              control={control}
              render={({ field: { onChange, ...otherProps } }) => (
                <Select
                  {...otherProps}
                  onChange={(value) => {
                    onChange(value)
                  }}
                  isSearch
                  options={localeOptions}
                  placeholder={format('locale.label')}
                  isInvalid={errors.locale}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.locale && <ValidationError value={errors.locale?.message} />}
          </div>
          <label className='flex gap-x-2 items-center' htmlFor='sector-displayable'>
            <Checkbox {...register('isDisplayable')} />
            {format('sector.is-displayable.label')}
          </label>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.sector.label')}`}
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
  ) : (
    <Unauthorized />
  )
})

SectorForm.displayName = 'SectorForm'

export default SectorForm

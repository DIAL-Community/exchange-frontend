import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import Input from '../shared/Input'
import ValidationError from '../shared/ValidationError'
import Dialog, { DialogType } from '../shared/Dialog'
import Checkbox from '../shared/Checkbox'
import Select from '../shared/Select'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { CREATE_SECTOR } from '../../mutations/sectors'
import { getLanguageOptions } from '../../lib/utilities'

const SectorForm = ({ isOpen, onClose, sector }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const [session] = useSession()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const { data, refetch: refetchSectors } = useQuery(SECTOR_SEARCH_QUERY, {
    variables: { search: '', locale }
  })

  const localeOptions = useMemo(() => getLanguageOptions(format), [format])

  const sectorLocale = useMemo(() => sector && localeOptions.find(({ value }) => value === sector.locale), [sector, localeOptions])

  const parentSectorOptions = useMemo(() => data?.sectors.map(({ id, name, slug }) => ({ id, label: name, slug, value: slug })) ?? [], [data?.sectors])

  const parentSector = useMemo(() => parentSectorOptions.find(({ id }) => id === sector?.parentSectorId?.toString()), [parentSectorOptions, sector?.parentSectorId])

  const [updateSector, { called: isSubmitInProgress, reset }] = useMutation(CREATE_SECTOR, {
    refetchQueries:['SearchSectors'],
    onCompleted: () => {
      showToast(
        format('toast.sector.submit.success'),
        'success',
        'top-center'
      )
      onClose(true)
      reset()
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{format('toast.sector.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors }, setValue, reset: resetFormValues } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: sector?.name,
      locale: sectorLocale,
      parentSector,
      isDisplayable: sector?.isDisplayable
    }
  })

  const onSectorLocaleChange = ({ value }) => {
    refetchSectors({ search: '', locale: value })
    setValue('parentSector', null)
  }

  useEffect(() => {
    if (isOpen) {
      resetFormValues({
        name: sector?.name,
        locale: sectorLocale ?? localeOptions.find(({ value }) => value === locale),
        parentSector,
        isDisplayable: sector?.isDisplayable
      })
    } else {
      refetchSectors({ search: '', locale: sectorLocale?.value })
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const slug = sector?.slug ?? ''

  const doUpsert = async (data) => {
    if (session) {
      const { userEmail, userToken } = session.user
      const { name, locale, parentSector, isDisplayable } = data
      const variables = {
        name,
        slug,
        locale: locale.value,
        isDisplayable
      }
      if (parentSector) {
        variables.parentSectorId = Number(parentSector.id)
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

  return (
    <Dialog
      submitButton
      cancelButton
      isOpen={isOpen}
      onClose={onClose}
      formId='sector-form'
      isSubmitInProgress={isSubmitInProgress}
      dialogType={DialogType.FORM}
    >
      <div className='w-full'>
        <form onSubmit={handleSubmit(doUpsert)} id='sector-form'>
          <div className='pb-12 mb-4 flex flex-col gap-3'>
            <div className='text-2xl font-bold text-dial-blue pb-4'>
              {sector
                ? format('app.edit-entity', { entity: sector.name })
                : `${format('app.create-new')} ${format('sector.label')}`
              }
            </div>
            <div className='flex flex-col gap-y-2 mb-2' data-testid='sector-name'>
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
            <div className='flex flex-col gap-y-2 mb-2' data-testid='sector-locale'>
              <label className='text-xl text-dial-blue required-field' htmlFor='locale'>
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
                      onSectorLocaleChange(value)
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
            <div className='flex flex-col gap-y-2 mb-2' data-testid='sector-parent'>
              <label className='text-xl text-dial-blue' htmlFor='parent'>
                {format('sector.parent-sector.label')}
              </label>
              <Controller
                name='parentSector'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isSearch
                    isClearable
                    options={parentSectorOptions}
                    placeholder={format('sector.parent-sector.label')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2 mb-2' data-testid='sector-displayable'>
              <label className='flex gap-x-2 mb-2 items-center self-start form-field-label' htmlFor='sector-displayable'>
                <Checkbox {...register('isDisplayable')} />
                {format('sector.is-displayable.label')}
              </label>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default SectorForm

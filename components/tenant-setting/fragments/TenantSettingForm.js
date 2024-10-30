import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_TENANT_SETTING } from '../../shared/mutation/tenantSetting'
import { TENANT_SETTINGS_QUERY } from '../../shared/query/tenantSetting'

const TenantSettingForm = React.memo(({ tenantSetting }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateTenantSetting, { reset }] = useMutation(CREATE_TENANT_SETTING, {
    refetchQueries: [{
      query: TENANT_SETTINGS_QUERY,
      variables: {},
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { createTenantSetting: response } = data
      if (response.tenantSetting && response.errors.length === 0) {
        const redirectPath = `/admin/tenant-settings/${response.tenantSetting.tenantName}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.tenantSetting.label') }),
          redirectHandler
        )
        setMutating(false)
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.tenantSetting.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.tenantSetting.label') }))
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      tenantName: tenantSetting?.tenantName,
      allowUnsecuredRead: tenantSetting?.allowUnsecuredRead ?? true,
      tenantDomains: (tenantSetting?.tenantDomains ?? ['example.localhost']).map(domain => {
        return {
          domain
        }
      })
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tenantDomains'
  })

  const doUpsert = async (data) => {
    setMutating(true)
    const { tenantName, tenantDomains, allowUnsecuredRead } = data
    const variables = {
      tenantName,
      tenantDomains: tenantDomains.map(d => d.domain),
      allowUnsecuredRead
    }
    updateTenantSetting({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/admin/tenant-settings/${tenantSetting?.tenantName}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 min-h-[70vh]'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {tenantSetting
              ? format('app.editEntity', { entity: tenantSetting.name })
              : `${format('app.createNew')} ${format('ui.tenantSetting.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='tenantName'>
              {format('ui.tenantSetting.tenantName')}
            </label>
            <Input
              {...register('tenantName', {
                required: format('ui.validation.required'),
                // pattern: {
                //   value: /^[A-Za-z]*$/,
                //   message: format('ui.validation.pattern.alphaOnly')
                // },
                maxLength: {
                  value: 16,
                  message: format('ui.validation.maxLength', { maxLength: 16 })
                }
              })}
              id='tenantName'
              placeholder={format('ui.tenantSetting.tenantName')}
              isInvalid={errors.tenantName}
            />
            {errors.tenantName && <ValidationError value={errors.tenantName?.message} />}
          </div>
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register('allowUnsecuredRead')} />
            {format('ui.tenantSetting.allowUnsecuredRead')}
          </label>
          <div className='flex flex-col gap-y-3'>
            <div className='text-sm'>
              {format('ui.tenantSetting.tenantDomains')}
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className='flex flex-col gap-y-2'>
                <label className='required-field sr-only' htmlFor={`tenant-domains-${index}`}>
                  {format('ui.tenantSetting.tenantDomain')}
                </label>
                <div className='flex flex-row gap-x-2'>
                  <Input
                    {...register(`tenantDomains.${index}.domain`, { required: format('validation.required') })}
                    id={`tenant-domains-${index}`}
                    defaultValue={fields[index].domain}
                    placeholder={format('ui.tenantSetting.tenantDomain')}
                    isInvalid={errors.tenantDomains?.[index]?.domain}
                  />
                  <button
                    type='button'
                    className='bg-red-500 text-white px-3 rounded shadow'
                    onClick={() => remove(index)}
                  >
                    <FaMinus />
                  </button>
                </div>
                {errors.tenantDomains?.[index]?.domain
                  && <ValidationError value={errors.tenantDomains?.[index]?.domain?.message} />
                }
              </div>
            ))}
            <div className='flex flex-row gap-x-2'>
              <button
                type='button'
                className='bg-dial-iris-blue text-white px-3 py-3 rounded shadow ml-auto'
                onClick={() => append(
                  { domain: 'replace-with-valid-domain' },
                  { focusIndex: fields.length }
                )}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.tenantSetting.label')}`}
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

TenantSettingForm.displayName = 'TenantSettingForm'

export default TenantSettingForm

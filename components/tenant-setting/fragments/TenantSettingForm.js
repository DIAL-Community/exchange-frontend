import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import * as FetchStatus from '../../shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_TENANT_SETTING } from '../../shared/mutation/tenantSetting'
import { TENANT_SETTINGS_QUERY } from '../../shared/query/tenantSetting'

const TenantSettingForm = React.memo(({ tenantSetting }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateTenantSetting, { reset }] = useMutation(CREATE_TENANT_SETTING, {
    refetchQueries: [{
      query: TENANT_SETTINGS_QUERY,
      variables: {}
    }],
    onCompleted: (data) => {
      if (data.createTenantSetting.tenantSetting && data.createTenantSetting.errors.length === 0) {
        const redirectPath = `/admin/tenant-settings/${data.createTenantSetting.tenantSetting.tenantName}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.tenantSetting.label') }),
          redirectHandler
        )
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
      name: tenantSetting?.tenantName,
      domains: tenantSetting?.tenantDomains.map(domain => {
        return {
          domain
        }
      })
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'domains'
  })

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
      const { name, domains } = data
      const variables = {
        tenantName: name,
        tenantDomains: domains.map(d => d.domain),
        allowUnsecureRead: tenantSetting?.allowUnsecureRead
      }

      updateTenantSetting({
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
    router.push(`/admin/tenant-settings/${tenantSetting?.tenantName}`)
  }

  return loadingUserSession
    ? <FetchStatus.Loading />
    : user.isAdminUser || user.isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 min-h-[70vh]'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {tenantSetting
                  ? format('app.editEntity', { entity: tenantSetting.name })
                  : `${format('app.createNew')} ${format('ui.tenantSetting.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('ui.tenantSetting.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.tenantSetting.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-3'>
                <div className='text-sm'>
                  {format('ui.tenantSetting.domain')}
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex flex-col gap-y-2'>
                    <label className='required-field sr-only' htmlFor={`domains-${index}`}>
                      {format('ui.tenantSetting.domain')}
                    </label>
                    <div className='flex flex-row gap-x-2'>
                      <Input
                        {...register(`domains.${index}.domain`, { required: format('validation.required') })}
                        id={`domains-${index}`}
                        defaultValue={fields[index].domain}
                        placeholder={format('ui.tenantSetting.domain')}
                        isInvalid={errors.domains?.[index]?.domain}
                      />
                      <button
                        type='button'
                        className='bg-red-500 text-white px-3 rounded shadow'
                        onClick={() => remove(index)}
                      >
                        <FaMinus />
                      </button>
                    </div>
                    {errors.domains?.[index]?.domain
                      && <ValidationError value={errors.domains?.[index]?.domain?.message} />
                    }
                  </div>
                )
                )}
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
      : <FetchStatus.Unauthorized />
})

TenantSettingForm.displayName = 'TenantSettingForm'

export default TenantSettingForm

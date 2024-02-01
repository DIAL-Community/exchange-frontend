import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { SYNC_TENANTS } from '../../shared/mutation/sync'
import SyncBuildingBlocks from './SyncBuildingBlocks'
import SyncDatasets from './SyncDatasets'
import SyncProducts from './SyncProducts'
import SyncProjects from './SyncProjects'
import SyncUseCases from './SyncUseCases'

const SyncTenants = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [datasets, setDatasets] = useState([])
  const [products, setProducts] = useState([])
  const [projects, setProjects] = useState([])
  const [useCases, setUseCases] = useState([])

  const { user, loadingUserSession } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [mutating, setMutating] = useState(false)

  const { handleSubmit, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      origin: '',
      destination: ''
    }
  })

  const [syncTenants, { reset }] = useMutation(SYNC_TENANTS, {
    onCompleted: (data) => {
      const { syncTenants: response } = data
      if (response.syncCompleted && response.errors.length === 0) {
        setMutating(false)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.syncTenant.header') }))
      } else {
        const [message] = response.errors
        showFailureMessage(message)
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.syncTenant.header') }))
      setMutating(false)
      reset()
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { sourceTenant, destinationTenant } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        sourceTenant: sourceTenant.value,
        destinationTenant: destinationTenant.value,
        buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug),
        datasetSlugs: datasets.map(({ slug }) => slug),
        productSlugs: products.map(({ slug }) => slug),
        projectSlugs: projects.map(({ slug }) => slug),
        useCaseSlugs: useCases.map(({ slug }) => slug)
      }

      syncTenants({
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

  const generateTenants = (format) => [
    { label: format('ui.tenants.default'), value: 'public' },
    { label: format('ui.tenants.fao'), value: 'fao' }
  ]

  return loadingUserSession
    ? <Loading />
    : canEdit
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-stratos'>
            <div className='flex flex-col gap-y-3 text-sm'>
              <div className='text-xl font-semibold'>
                {format('ui.syncTenant.header')}
              </div>
              <div className='flex flex-col md:flex-row gap-3'>
                <div className='md:basis-1/2'>
                  <div className='flex flex-col gap-y-2'>
                    <label className='text-dial-sapphire required-field'>
                      {format('ui.syncTenant.sourceTenants')}
                    </label>
                    <Controller
                      name='sourceTenant'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isSearch
                          options={generateTenants(format)}
                          placeholder={format('ui.syncTenant.sourceTenants')}
                          isInvalid={errors.sourceTenant}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.indicatorType && <ValidationError value={errors.sourceTenant?.message} />}
                  </div>
                </div>
                <div className='md:basis-1/2'>
                  <div className='flex flex-col gap-y-2'>
                    <label className='text-dial-sapphire required-field'>
                      {format('ui.syncTenant.destinationTenants')}
                    </label>
                    <Controller
                      name='destinationTenant'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isSearch
                          options={generateTenants(format)}
                          placeholder={format('ui.syncTenant.destinationTenants')}
                          isInvalid={errors.destinationTenant}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.destinationTenant && <ValidationError value={errors.destinationTenant?.message} />}
                  </div>
                </div>
              </div>
              <SyncBuildingBlocks buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
              <div className='flex flex-col md:flex-row gap-3'>
                <div className='md:basis-1/2'>
                  <SyncDatasets datasets={datasets} setDatasets={setDatasets} />
                </div>
                <div className='md:basis-1/2'>
                  <SyncProducts products={products} setProducts={setProducts} />
                </div>
              </div>
              <SyncProjects projects={projects} setProjects={setProjects} />
              <SyncUseCases useCases={useCases} setUseCases={setUseCases} />
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating}>
                  {`${format('app.submit')} ${format('ui.sync.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3' />}
                </button>
              </div>
            </div>
          </div>
        </form>
      )
      : <Unauthorized />
}

export default SyncTenants

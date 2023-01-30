import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { getMappingStatusOptions } from '../../lib/utilities'
import { UPDATE_PRODUCT_SDGS } from '../../mutations/product'
import { SDG_SEARCH_QUERY } from '../../queries/sdg'
import { fetchSelectOptions } from '../../queries/utils'
import SDGCard from '../sdgs/SDGCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const ProductDetailSdgs = ({ product, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sdgs, setSdgs] = useState(product.sustainableDevelopmentGoals)

  const mappingStatusOptions = getMappingStatusOptions(format)

  const [mappingStatus, setMappingStatus] = useState(
    mappingStatusOptions.find(({ value: mappingStatus }) =>
      mappingStatus === (product?.sustainableDevelopmentGoalsMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const [isDirty, setIsDirty] = useState(false)

  const [updateProductSdgs, { data, loading, reset }] = useMutation(UPDATE_PRODUCT_SDGS, {
    onCompleted: (data) => {
      const { updateProductSdgs: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setSdgs(data.updateProductSdgs.product.sustainableDevelopmentGoals)
        showToast(format('toast.sdgs.update.success', { entity: format('sdg.label') }), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setSdgs(product?.sustainableDevelopmentGoals)
        showToast(format('toast.sdgs.update.failure', { entity: format('sdg.label') }), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setIsDirty(false)
      setSdgs(product?.sustainableDevelopmentGoals)
      showToast(format('toast.sdgs.update.failure', { entity: format('sdg.label') }), 'error', 'top-center')
      reset()
    }
  })

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedSdgsCallback = (data) => (
    data.sdgs.map((sdg) => ({
      label: sdg.name,
      value: sdg.id,
      slug: sdg.slug,
      imageFile: sdg.imageFile
    }))
  )

  const addSdg = (sdg) => {
    setSdgs([
      ...sdgs.filter(({ slug }) => slug !== sdg.slug),
      { name: sdg.label, slug: sdg.slug }
    ])
    setIsDirty(true)
  }

  const removeSdg = (sdg) => {
    setSdgs([...sdgs.filter(({ slug }) => slug !== sdg.slug)])
    setIsDirty(true)
  }

  const updateMappingStatus = (selectedMappingStatus) => {
    setMappingStatus(selectedMappingStatus)
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductSdgs({
        variables: {
          slug: product.slug,
          mappingStatus: mappingStatus.value,
          sdgsSlugs: sdgs.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setSdgs(data?.updateProductSdgs?.product?.sustainableDevelopmentGoals ?? product.sustainableDevelopmentGoals)
    setMappingStatus(mappingStatusOptions.find(({ value: mappingStatus }) =>
      mappingStatus === (
        data?.updateProductSdgs?.product?.sustainableDevelopmentGoalsMappingStatus ??
        product.sustainableDevelopmentGoalsMappingStatus
      )
    ))
    setIsDirty(false)
  }

  const displayModeBody = sdgs.length
    ? (
      <div className='grid grid-cols-1'>
        {sdgs.map((sdg, sdgsIdx) => <SDGCard key={sdgsIdx} sdg={sdg} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('product.no-sdgs', { entity: format('sdg.label') })}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('sdg.label')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2'>
        {format('product.mappingStatus')}
        <Select
          options={mappingStatusOptions}
          placeholder={format('product.mappingStatus')}
          onChange={updateMappingStatus}
          value={mappingStatus}
        />
      </label>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='sdgs-search'>
        {`${format('app.searchAndAssign')} ${format('sdg.label')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, SDG_SEARCH_QUERY, fetchedSdgsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg.label') })}
          onChange={addSdg}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {sdgs.map((sdg, sdgIdx) => (
          <Pill
            key={`sdgs-${sdgIdx}`}
            label={sdg.name}
            onRemove={() => removeSdg(sdg)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('sdg.label')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProductDetailSdgs

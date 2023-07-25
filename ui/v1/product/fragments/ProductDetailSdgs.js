import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import SdgCard from '../../sdg/SdgCard'
import { DisplayType } from '../../utils/constants'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { generateMappingStatusOptions } from '../../shared/form/options'
import { UPDATE_PRODUCT_SDGS } from '../../shared/mutation/product'
import { SDG_SEARCH_QUERY } from '../../shared/query/sdg'

const ProductDetailSdgs = ({ product, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sdgs, setSdgs] = useState(product.sdgs)
  const [isDirty, setIsDirty] = useState(false)

  const mappingStatusOptions =
    generateMappingStatusOptions(format)
      .filter(
        (status) =>
          status.label === `${format('shared.mappingStatus.beta')}` ||
          status.label === `${format('shared.mappingStatus.validated')}`
      )

  const [mappingStatus, setMappingStatus] = useState(
    mappingStatusOptions.find(({ value: mappingStatus }) =>
      mappingStatus === (product?.sdgsMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const updateMappingStatus = (selectedMappingStatus) => {
    setMappingStatus(selectedMappingStatus)
    setIsDirty(true)
  }

  const [updateProductSdgs, { data, loading, reset }] = useMutation(UPDATE_PRODUCT_SDGS, {
    onError() {
      setIsDirty(false)
      setSdgs(product?.sdgs)
      showToast(format('toast.sdgs.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateProductSdgs: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setSdgs(response?.product?.sdgs)
        showToast(format('toast.sdgs.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setSdgs(product?.sdgs)
        showToast(format('toast.sdgs.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedSdgsCallback = (data) => (
    data.sdgs?.map((sdg) => ({
      id: sdg.id,
      name: sdg.name,
      label: `${sdg.number}. ${sdg.name}`,
      slug: sdg.slug,
      number: sdg.number
    }))
  )

  const addSdgs = (sdg) => {
    setSdgs([
      ...[
        ...sdgs.filter(({ id }) => id !== sdg.id), {
          id: sdg.id,
          name: sdg.name,
          slug: sdg.slug,
          number: sdg.number
        }
      ].sort((a, b) => {
        const diff = parseInt(a.number) - parseInt(b.number)

        return diff === 0 ? a.number.localeCompare(b.number) : diff
      })
    ])
    setIsDirty(true)
  }

  const removeSdgs = (sdg) => {
    setSdgs([...sdgs.filter(({ id }) => id !== sdg.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductSdgs({
        variables: {
          slug: product.slug,
          sdgSlugs: sdgs.map(({ slug }) => slug),
          mappingStatus: mappingStatus.value
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
    setSdgs(data?.updateProductSdgs?.product?.sdgs ?? product.sdgs)
    setIsDirty(false)
  }

  const displayModeBody = sdgs.length
    ? sdgs?.map((sdg, index) =>
      <SdgCard key={index} sdg={sdg} displayType={DisplayType.SMALL_CARD} />
    )
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', {
        entity: format('ui.sdg.label'),
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-meadow' ref={headerRef}>
      {format('ui.sdg.longHeader')}
    </div>

  const editModeBody =
    <div className='px-8 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2 mb-2'>
        {format('app.mappingStatus')}
        <Select
          isBorderless
          options={mappingStatusOptions}
          placeholder={format('app.mappingStatus')}
          onChange={updateMappingStatus}
          value={mappingStatus}
        />
      </label>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.sdg.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SDG_SEARCH_QUERY, fetchedSdgsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg.label') })}
          onChange={addSdgs}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {sdgs.map((sdg, sdgIdx) => (
          <Pill
            key={`sdgs-${sdgIdx}`}
            label={`${sdg.number}. ${sdg.name}`}
            onRemove={() => removeSdgs(sdg)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
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

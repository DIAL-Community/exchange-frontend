import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import SdgCard from '../../sdg/SdgCard'
import EditableSection from '../../shared/EditableSection'
import { generateMappingStatusOptions } from '../../shared/form/options'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_PRODUCT_SDGS } from '../../shared/mutation/product'
import { SDG_SEARCH_QUERY } from '../../shared/query/sdg'
import { DisplayType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ProductDetailSdgs = ({ product, editingAllowed, headerRef }) => {
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

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductSdgs, { loading, reset }] = useMutation(UPDATE_PRODUCT_SDGS, {
    onError() {
      setIsDirty(false)
      setSdgs(product?.sdgs)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sdg.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductSdgs: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setSdgs(response?.product?.sdgs)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.sdg.header') }))
      } else {
        setIsDirty(false)
        setSdgs(product?.sdgs)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sdg.header') }))
        reset()
      }
    }
  })

  const fetchedSdgsCallback = (data) => (
    data.sdgs?.map((sdg) => ({
      id: sdg.id,
      name: sdg.name,
      label: `${sdg.number}. ${sdg.name}`,
      slug: sdg.slug,
      number: sdg.number
    }))
  )

  const addSdg = (sdg) => {
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

  const removeSdg = (sdg) => {
    setSdgs([...sdgs.filter(({ id }) => id !== sdg.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateProductSdgs({
      variables: {
        slug: product.slug,
        sdgSlugs: sdgs.map(({ slug }) => slug),
        mappingStatus: mappingStatus.value
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setSdgs(product.sdgs)
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

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.product.overview.sdg')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
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
          onChange={addSdg}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {sdgs.map((sdg, sdgIdx) => (
          <Pill
            key={`sdgs-${sdgIdx}`}
            label={`${sdg.number}. ${sdg.name}`}
            onRemove={() => removeSdg(sdg)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      sectionHeader={sectionHeader}
      sectionDisclaimer={sectionDisclaimer}
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

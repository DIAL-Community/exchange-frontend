import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_PRODUCT_SECTORS } from '../../shared/mutation/product'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'
import { fetchSelectOptions } from '../../utils/search'

const ProductDetailSectors = ({ product, editingAllowed }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sectors, setSectors] = useState(product.sectors)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductSectors, { loading, reset }] = useMutation(UPDATE_PRODUCT_SECTORS, {
    onError() {
      setIsDirty(false)
      setSectors(product?.sectors)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sector.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductSectors: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setSectors(response?.product?.sectors)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.sector.header') }))
      } else {
        setIsDirty(false)
        setSectors(product?.sectors)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sector.header') }))
        reset()
      }
    }
  })

  const fetchedSectorsCallback = (data) => (
    data.sectors?.map((sector) => ({
      id: sector.id,
      name: sector.name,
      slug: sector.slug,
      label: sector.name
    }))
  )

  const addSector = (sector) => {
    setSectors([
      ...[
        ...sectors.filter(({ id }) => id !== sector.id),
        { id: sector.id, name: sector.name, slug: sector.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeSector = (sector) => {
    setSectors([...sectors.filter(({ id }) => id !== sector.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateProductSectors({
      variables: {
        sectorSlugs: sectors.map(({ slug }) => slug),
        slug: product.slug
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setSectors(product.sectors)
    setIsDirty(false)
  }

  const displayModeBody = sectors.length
    ? <div className='flex flex-col gap-y-2'>
      {sectors?.map((sector, index) =>
        <div key={`sector-${index}`}>
          <div key={index}>{sector.name}</div>
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('general.na')}
    </div>

  const sectionHeader =
    <div className='font-semibold text-dial-meadow'>
      {format('ui.sector.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.sector.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.sector.label') })}
          onChange={addSector}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {sectors.map((sector, sectorIdx) => (
          <Pill
            key={`sectors-${sectorIdx}`}
            label={sector.name}
            onRemove={() => removeSector(sector)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
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

export default ProductDetailSectors

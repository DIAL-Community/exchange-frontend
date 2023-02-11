import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_PRODUCT_SECTORS } from '../../mutations/product'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { fetchSelectOptions } from '../../queries/utils'
import SectorCard from '../sectors/SectorCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const ProductDetailSectors = ({ product, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sectors, setSectors] = useState(product.sectors)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const [updateProductsSectors, { data, loading, reset }] = useMutation(UPDATE_PRODUCT_SECTORS, {
    onCompleted: (data) => {
      const { updateProductSectors: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setSectors(data.updateProductSectors.product.sectors)
        showToast(format('toast.sectors.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setSectors(product.sectors)
        showToast(format('toast.sectors.update.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setIsDirty(false)
      setSectors(product.sectors)
      showToast(format('toast.sectors.update.failure'), 'error', 'top-center')
      reset()
    }
  })

  const fetchedSectorsCallback = (data) => (
    data.sectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
      slug: sector.slug
    }))
  )

  const addSector = (sector) => {
    setSectors([...sectors.filter(({ slug }) => slug !== sector.slug), { name: sector.label, slug: sector.slug }])
    setIsDirty(true)
  }

  const removeSector = (sector) => {
    setSectors([...sectors.filter(({ slug }) => slug !== sector.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductsSectors({
        variables: {
          slug: product.slug,
          sectorsSlugs: sectors.map(({ slug }) => slug)
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
    setSectors(data?.updateProductSectors?.product?.sectors ?? product.sectors)
    setIsDirty(false)
  }

  const displayModeBody = sectors.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {sectors.map((sector, sectorIdx) => <SectorCard key={sectorIdx} sector={sector} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('product.no-sector')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('sector.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='sector-search'>
        {`${format('app.searchAndAssign')} ${format('sector.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback, locale)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sector.header') })}
          onChange={addSector}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {sectors.map((sector, sectorIdx) => (
          <Pill
            key={`sector-${sectorIdx}`}
            label={sector.name}
            onRemove={() => removeSector(sector)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('sector.header')}
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

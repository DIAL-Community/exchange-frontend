import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_PRODUCT_SDGS } from '../../mutations/product'
import { SDG_SEARCH_QUERY } from '../../queries/sdg'
import { fetchSelectOptions } from '../../queries/utils'
import SDGCard from '../sdgs/SDGCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const defaultMappingStatus = 'BETA'
 
const ProductDetailSdgs = ({ product, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
 
  const client = useApolloClient()
 
  const [sdgs, setSdgs] = useState(product.sustainableDevelopmentGoals)
 
  const [isDirty, setIsDirty] = useState(false)
 
  const [updateProductSdgs, { data, loading }] = useMutation(UPDATE_PRODUCT_SDGS, {
    onCompleted: (data) => {
      setSdgs(data.updateProductSdgs.product.sustainableDevelopmentGoals)
      setIsDirty(false)
      showToast(format('toast.sdgs.update.success', { entity: format('sdg.label') }), 'success', 'top-center')
    },
    onError: () => {
      setSdgs(product?.sustainableDevelopmentGoals)
      setIsDirty(false)
      showToast(format('toast.sdgs.update.failure', { entity: format('sdg.label') }), 'error', 'top-center')
    }
  })
  
  const [session] = useSession()
  
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
  
  const addSdgs = (sdg) => {
    setSdgs([
      ...sdgs.filter(({ slug }) => slug !== sdg.slug),
      { name: sdg.label, slug: sdg.slug }
    ])
    setIsDirty(true)
  }
 
  const removeSdgs = (sdg) => {
    setSdgs([...sdgs.filter(({ slug }) => slug !== sdg.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user
       
      updateProductSdgs({
        variables: {
          slug: product.slug,
          sdgsSlugs: sdgs.map(({ slug }) => slug),
          mappingStatus: defaultMappingStatus,
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
         onChange={addSdgs}
         value={null}
       />
     </label>
     <div className='flex flex-wrap gap-3 mt-5'>
       {sdgs.map((sdg, sdgIdx) => (
         <Pill
           key={`sdgs-${sdgIdx}`}
           label={sdg.name}
           onRemove={() => removeSdgs(sdg)}
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

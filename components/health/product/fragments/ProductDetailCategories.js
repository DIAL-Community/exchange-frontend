import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import Select from '../../../shared/form/Select'
import EditableSection from '../../../shared/EditableSection'
import Pill from '../../../shared/form/Pill'
import { fetchSelectOptions } from '../../../utils/search'
import { UPDATE_PRODUCT_CATEGORIES } from '../../../shared/mutation/product'
import { CATEGORY_SEARCH_QUERY } from '../../../shared/query/category'

const ProductDetailCategories = ({ product, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [categories, setCategories] = useState(product.softwareCategories)
  const [features, setFeatures] = useState(product.softwareFeatures)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductCategories, { loading, reset }] = useMutation(UPDATE_PRODUCT_CATEGORIES, {
    onError() {
      setIsDirty(false)
      setCategories(product?.softwareCategories)
      setFeatures(product?.softwareFeatures)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.category.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductCategories: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setCategories(response?.product?.softwareCategories)
        setFeatures(response?.product?.softwareFeatures)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.category.header') }))
      } else {
        setIsDirty(false)
        setCategories(product?.softwareCategories)
        setFeatures(product?.softwareFeatures)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.category.header') }))
        reset()
      }
    }
  })

  const fetchedCategoriesCallback = (data) => (
    data.softwareCategories?.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      label: category.name,
      softwareFeatures: category.softwareFeatures
    }))
  )

  const addCategory = (category) => {
    setCategories([
      ...[
        ...categories.filter(({ id }) => id !== category.id),
        { id: category.id, name: category.name, slug: category.slug, softwareFeatures: category.softwareFeatures }
      ]
    ])
    setIsDirty(true)
  }

  const removeCategory = (category) => {
    setCategories([...categories.filter(({ id }) => id !== category.id)])
    setFeatures([...features.filter(({ categoryId }) => categoryId !== category.id)])
    setIsDirty(true)
  }

  const addFeature = (feature) => {
    setFeatures([
      ...[
        ...features.filter(({ id }) => id !== feature.id),
        { id: feature.id, name: feature.name, slug: feature.slug, categoryId: feature.categoryId }
      ]
    ])
    setIsDirty(true)
  }

  const removeFeature = (feature) => {
    setFeatures([...features.filter(({ id }) => id !== feature.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductCategories({
        variables: {
          categorySlugs: categories.map(({ slug }) => slug),
          featureSlugs: features.map(({ slug }) => slug),
          slug: product.slug
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
    setCategories(product.softwareCategories)
    setFeatures(product.softwareFeatures)
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
      {format('ui.category.header')}
    </div>

  const featureOptions = (input) => {
    const currCategory = categories.filter(({ id }) => id === input.id)

    return currCategory && currCategory[0].softwareFeatures?.map((feature) => ({
      id: feature.id,
      name: feature.name,
      slug: feature.slug,
      label: feature.name,
      categoryId: currCategory[0].id
    }))
  }

  const displayModeBody = categories.length
    ? <div className='flex flex-col gap-y-2'>
      {categories?.map((category, index) =>
        <div key={`category-${index}`}>
          <div key={index} className='text-health-red'>{category.name}
            <span className='text-black'>{' - '}</span>
            {features?.filter((feature) => feature.categoryId == category.id).map((feature, featureIdx, arr) =>
              <span
                className='text-black'
                key={`category-${featureIdx}`}
              >
                {feature.name}{featureIdx < arr.length - 1 ? ', ' : ' '}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('general.na')}
    </div>

  const editModeBody =
    <>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
        <label className='flex flex-col gap-y-2'>
          {`${format('app.searchAndAssign')} ${format('ui.category.label')}`}
          <Select
            async
            isSearch
            isBorderless
            defaultOptions
            cacheOptions
            placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
            loadOptions={(input) =>
              fetchSelectOptions(client, input, CATEGORY_SEARCH_QUERY, fetchedCategoriesCallback)
            }
            noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.category.label') })}
            onChange={addCategory}
            value={null}
          />
        </label>
        <div className='flex flex-wrap gap-3'>
          {categories.map((category, categoryIdx) => (
            <div className='grid grid-cols-3 w-full' key={`categories-${categoryIdx}`}>
              <div className='py-4'>
                <div className='pb-2'>{`${format('ui.category.label')}`}</div>
                <Pill
                  label={category.name}
                  onRemove={() => removeCategory(category)}
                />
              </div>
              <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm col-span-2'>
                <label className='flex flex-col gap-y-2'>
                  {`${format('app.searchAndAssign')} ${format('ui.feature.label')}`}
                  <Select
                    isSearch
                    isBorderless
                    defaultOptions
                    placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
                    options={featureOptions(category)}
                    noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.feature.label') })}
                    onChange={addFeature}
                    value={null}
                  />
                </label>
                <div className='flex flex-wrap gap-3'>
                  {features.filter((feature) => feature.categoryId == category.id).map((feature, featureIdx) => (
                    <Pill
                      key={`sectorfeatures-${featureIdx}`}
                      label={feature.name}
                      onRemove={() => removeFeature(feature)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

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

export default ProductDetailCategories

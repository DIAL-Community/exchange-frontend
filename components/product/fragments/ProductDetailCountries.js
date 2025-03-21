import { useCallback, useContext, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { FaCircleChevronDown, FaCircleChevronUp } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import CountryCard from '../../country/CountryCard'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import HidableSection from '../../shared/HidableSection'
import { UPDATE_PRODUCT_COUNTRIES } from '../../shared/mutation/product'
import { COUNTRY_SEARCH_QUERY } from '../../shared/query/country'
import { DisplayType, ObjectType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ProductDetailCountries = ({ product, editingAllowed, editingSection, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [expanded, setExpanded] = useState(false)

  const [countries, setCountries] = useState(product.countries)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductCountries, { loading, reset }] = useMutation(UPDATE_PRODUCT_COUNTRIES, {
    onError() {
      setIsDirty(false)
      setCountries(product?.countries)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.country.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductCountries: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setCountries(response?.product?.countries)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.country.header') }))
      } else {
        setIsDirty(false)
        setCountries(product?.countries)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.country.header') }))
        reset()
      }
    }
  })

  const fetchedCountriesCallback = (data) => (
    data.countries?.map((country) => ({
      id: country.id,
      name: country.name,
      slug: country.slug,
      label: country.name
    }))
  )

  const addCountry = (country) => {
    setCountries([
      ...[
        ...countries.filter(({ id }) => id !== country.id),
        { id: country.id, name: country.name, slug: country.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeCountry = (country) => {
    setCountries([...countries.filter(({ id }) => id !== country.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateProductCountries({
      variables: {
        countrySlugs: countries.map(({ slug }) => slug),
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
    setCountries(product.countries)
    setIsDirty(false)
  }

  const toggleExpanded = () => setExpanded(!expanded)

  const displayModeBody = countries.length
    ? <div className='flex flex-col gap-y-3'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
        {countries?.slice(0, 4).map((country, index) =>
          <div key={`country-${index}`}>
            <CountryCard country={country} displayType={DisplayType.SMALL_CARD} />
          </div>
        )}
      </div>
      <div className='overflow-hidden'>
        <div
          className={classNames(
            !expanded ? '-mt-[100%]' : 'mt-0',
            'will-change-auto transition-all duration-500 ease-in-out',
            'grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'
          )}
        >
          {countries?.slice(4).map((country, index) =>
            <div key={`country-${index}`}>
              <CountryCard country={country} displayType={DisplayType.SMALL_CARD} />
            </div>
          )}
        </div>
      </div>
      {countries?.length > 4 && expanded && <div />}
      {countries?.length > 4 &&
        <div className='flex justify-center items-center border-t-2 border-dashed'>
          <label className='text-dial-sapphire'>
            <input
              type='checkbox'
              className='hidden'
              checked={expanded}
              onChange={toggleExpanded}
            />
            {expanded
              ? <FaCircleChevronUp size='1.25rem' className='-mt-3' />
              : <FaCircleChevronDown size='1.25rem'  className='-mt-3' />
            }
          </label>
        </div>
      }
    </div>
    : <div className='text-sm text-dial-stratos mb-4'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.country.label'),
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-meadow' ref={headerRef}>
      {format('ui.country.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.product.overview.country')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.country.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedCountriesCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.country.label') })}
          onChange={addCountry}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {countries.map((country, countryIdx) => (
          <Pill
            key={`countries-${countryIdx}`}
            label={country.name}
            onRemove={() => removeCountry(country)}
          />
        ))}
      </div>
    </div>

  const hidableSection = (
    <HidableSection
      objectKey='countries'
      objectType={ObjectType.PRODUCT}
      disabled={!editingSection}
      displayed={editingAllowed}
    />
  )

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      hidableSection={hidableSection}
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

export default ProductDetailCountries

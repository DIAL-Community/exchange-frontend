import { useIntl } from 'react-intl'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Card from '../shared/Card'
import { ToastContext } from '../../lib/ToastContext'
import Select from '../shared/Select'
import Pill from '../shared/Pill'
import EditableSection from '../shared/EditableSection'
import { useUser } from '../../lib/hooks'
import { UPDATE_RUBRIC_CATEGORY_INDICATORS } from '../../mutations/rubric-category'
import { CATEGORY_INDICATORS_SEARCH_QUERY } from '../../queries/category-indicator'

const RubricCategoryDetailCategoryIndicators = ({ categoryIndicators, rubricCategorySlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const [indicators, setIndicators] = useState(categoryIndicators)
  const [isDirty, setIsDirty] = useState(false)

  const { user, isAdminUser } = useUser()

  const router = useRouter()

  const { locale } = router

  const { data: dataCategoryIndicators } = useQuery(CATEGORY_INDICATORS_SEARCH_QUERY, { variables: { search: '' } })

  const options = useMemo(() => (
    dataCategoryIndicators?.categoryIndicators.map((indicator) => ({
      label: indicator.name,
      id: indicator.id,
      slug: indicator.slug
    }))
  ), [dataCategoryIndicators])

  const [indicatorOptions, setIndicatorOptions] = useState([])

  useEffect(() => setIndicatorOptions(options), [options])

  const [updateRubricCategoryIndicators, { data, loading, reset }] = useMutation(UPDATE_RUBRIC_CATEGORY_INDICATORS, {
    refetchQueries: ['CategoryIndicators'],
    onCompleted: (data) => {
      const { updateRubricCategoryIndicators: response } = data
      if (response?.rubricCategory && response?.errors?.length === 0) {
        setIsDirty(false)
        setIndicators(response?.rubricCategory?.categoryIndicators)
        showToast(format('toast.category-indicator.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setIndicators(categoryIndicators)
        showToast(format('toast.category-indicator.update.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setIsDirty(false)
      setIndicators(categoryIndicators)
      showToast(format('toast.category-indicator.update.failure'), 'error', 'top-center')
      reset()
    }
  })

  const addIndicator = (indicator) => {
    setIndicators([
      ...indicators.filter(({ slug }) => slug !== indicator.slug),
      { name: indicator.label, slug: indicator.slug }
    ])
    setIndicatorOptions(indicatorOptions.filter(({ slug }) => slug !== indicator.slug))
    setIsDirty(true)
  }

  const removeIndicator = (indicator) => {
    setIndicators([...indicators.filter(({ slug }) => slug !== indicator.slug)])
    setIndicatorOptions([...indicatorOptions.filter(({ slug }) => slug !== indicator.slug),
      { label: indicator.name, slug: indicator.slug, id: indicator.id }
    ])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateRubricCategoryIndicators({
        variables: {
          rubricCategorySlug,
          categoryIndicatorSlugs: indicators.map(({ slug }) => slug)
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
    setIndicators(data?.updateRubricCategoryIndicators.rubricCategory.categoryIndicators ?? categoryIndicators)
    setIndicatorOptions(options)
    setIsDirty(false)
  }

  const displayModeBody = indicators?.length
    ? (
      <div className='grid sm:grid-cols-1 lg:grid-cols-2'>
        {indicators.map((indicator, indicatorIdx) => (
          <Card
            key={indicatorIdx}
            className="font-semibold text-button-gray items-center"
            href={`/rubric_categories/${rubricCategorySlug}/${indicator.slug}`}
          >
            {indicator.name}
          </Card>
        ))}
      </div>
    )
    : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('ui.rubricCategory.no-indicator')}
      </div>
    )

  const editModeBody = (
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('categoryIndicator.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='indicator-search'>
        {`${format('app.searchAndAssign')} ${format('categoryIndicator.header')}`}
        <Select
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          options={indicatorOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('categoryIndicator.header') })}
          onChange={addIndicator}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {indicators?.map((indicator, indicatorIdx) => (
          <Pill
            key={`indicator-${indicatorIdx}`}
            label={indicator.name}
            onRemove={() => removeIndicator(indicator)}
          />
        ))}
      </div>
    </>
  )

  return (
    <EditableSection
      canEdit={isAdminUser}
      sectionHeader={format('categoryIndicator.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
      createAction={() => router.push(`/rubric_categories/${rubricCategorySlug}/create`)}
    />
  )
}

export default RubricCategoryDetailCategoryIndicators

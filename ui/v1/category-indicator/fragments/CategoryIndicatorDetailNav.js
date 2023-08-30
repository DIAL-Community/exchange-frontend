import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Select from '../../shared/form/Select'

const CategoryIndicatorDetailNav = ({ scrollRef, rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  let categoryIndicatorNavOptions = []
  if (rubricCategory?.categoryIndicators) {
    categoryIndicatorNavOptions = rubricCategory.categoryIndicators.map((categoryIndicator) => {
      return {
        label: <div className='px-2'>{format('categoryIndicator.label')}: {categoryIndicator.name}</div>,
        value: `ui.categoryIndicators.indicators.${categoryIndicator.slug}`
      }
    })
  }

  const navOptions = [{
    label: format('categoryIndicator.parent.detail'),
    value: 'categoryIndicator.parent.detail'
  }, {
    label: format('ui.common.detail.description'),
    value: 'ui.common.detail.description'
  }, ...categoryIndicatorNavOptions]

  const onNavigationChange = (selectedNav) => {
    const { value } = selectedNav
    if (value.indexOf('ui.categoryIndicators.indicators.') >= 0) {
      const destinationSlug = value.replace('ui.categoryIndicators.indicators.', '')
      const destinationRoute =
        `/rubric-categories/${rubricCategory.slug}` +
        `/category-indicators/${destinationSlug}`
      router.push(destinationRoute)
    } else if (value.indexOf('categoryIndicator.parent.detail') >= 0) {
      const destinationRoute = `/rubric-categories/${rubricCategory.slug}`
      router.push(destinationRoute)
    } else if (scrollRef && scrollRef.current) {
      const scrollTargetRef = scrollRef.current.find(ref => ref.value === value)
      scrollTargetRef?.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const fetchOptions = async (input) => {
    return navOptions.filter(({ label }) => label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3 text-sm py-3'>
      <div className='font-semibold text-dial-plum'>
        {format('ui.shared.jumpTo')}
      </div>
      <Select
        async
        isBorderless
        aria-label={format('ui.ribbon.nav.ariaLabel')}
        cacheOptions
        defaultOptions={navOptions}
        loadOptions={fetchOptions}
        onChange={onNavigationChange}
        value={null}
      />
    </div>
  )
}

export default CategoryIndicatorDetailNav

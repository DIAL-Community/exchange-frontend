import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Card from '../shared/Card'

const RubricCategoryDetailCategoryIndicators = ({ categoryIndicators }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <div className='mt-8 card-title mb-3 text-dial-gray-dark'>{format('category-indicators.label')}</div>
      <div className='grid sm:grid-cols-1 lg:grid-cols-2' data-testid='indicators'>
        {
          categoryIndicators?.length
            ? categoryIndicators.map((categoryIndicator, categoryIndicatorIdx) => (
              <Card
                key={categoryIndicatorIdx}
                className='font-semibold text-button-gray items-center'
                href={`/category_indicators/${categoryIndicator.slug}`}
              >
                {categoryIndicator.name}
              </Card>
            ))
            : (
              <div className='col-span-1 sm:col-span-2 lg:col-span-3'>
                {format('noResults.entity', { entity: format('category-indicators.label') })}
              </div>
            )
        }
      </div>
    </>
  )
}

export default RubricCategoryDetailCategoryIndicators

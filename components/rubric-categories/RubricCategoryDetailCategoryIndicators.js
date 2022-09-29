import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Card from '../shared/Card'
import CreateButton from '../shared/CreateButton'

const RubricCategoryDetailCategoryIndicators = ({ categoryIndicators, rubricCategorySlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <div className='flex mt-8 mb-3 items-center justify-between'>
        <div className='card-title text-dial-gray-dark'>{format('category-indicators.label')}</div>
        <CreateButton
          label={format('app.create-new')}
          type='link'
          href={`/rubric_categories/${rubricCategorySlug}/create_category_indicator`} />
      </div>
      <div className='grid sm:grid-cols-1 lg:grid-cols-2' data-testid='indicators'>
        {
          categoryIndicators?.length
            ? categoryIndicators.map((categoryIndicator, categoryIndicatorIdx) => (
              <Card
                key={categoryIndicatorIdx}
                className='font-semibold text-button-gray items-center'
                href={`/rubric_categories/${rubricCategorySlug}/${categoryIndicator.slug}`}
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

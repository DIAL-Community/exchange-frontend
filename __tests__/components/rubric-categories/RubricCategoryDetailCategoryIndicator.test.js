import { fireEvent, screen } from '@testing-library/react'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import RubricCategoryDetailCategoryIndicators
  from '../../../components/rubric-categories/RubricCategoryDetailCategoryIndicators'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { CATEGORY_INDICATORS_SEARCH_QUERY } from '../../../queries/category-indicator'
import { categoryIndicators, rubricCategory } from './data/RubricCategoryDetailCategoryIndicators'

mockNextUseRouter()

describe('Unit test for the RubricCategoryDetailCategoryIndicators component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CATEGORY_INDICATOR_SEARCH_TEST_ID = 'indicator-search'
  const CATEGORY_INDICATOR_SEARCH_OPTION_LABEL = 'Category Indicator 2'
  const RUBRIC_CATEGORY_TEST_CATEGORY_INDICATOR_LABEL = 'Category Indicator 1'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockCategoryIndicators = generateMockApolloData(
    CATEGORY_INDICATORS_SEARCH_QUERY,
    { search: '' },
    null,
    categoryIndicators
  )

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicators]}>
        <RubricCategoryDetailCategoryIndicators
          categoryIndicators={rubricCategory.categoryIndicators}
          rubricCategorySlug={rubricCategory.slug}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicators]}>
        <RubricCategoryDetailCategoryIndicators
          categoryIndicators={rubricCategory.categoryIndicators}
          rubricCategorySlug={rubricCategory.slug}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicators]}>
        <RubricCategoryDetailCategoryIndicators
          categoryIndicators={rubricCategory.categoryIndicators}
          rubricCategorySlug={rubricCategory.slug}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicators]}>
        <RubricCategoryDetailCategoryIndicators
          categoryIndicators={rubricCategory.categoryIndicators}
          rubricCategorySlug={rubricCategory.slug}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicators]}>
        <RubricCategoryDetailCategoryIndicators
          categoryIndicators={rubricCategory.categoryIndicators}
          rubricCategorySlug={rubricCategory.slug}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(CATEGORY_INDICATOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(CATEGORY_INDICATOR_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(CATEGORY_INDICATOR_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(RUBRIC_CATEGORY_TEST_CATEGORY_INDICATOR_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(CATEGORY_INDICATOR_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(RUBRIC_CATEGORY_TEST_CATEGORY_INDICATOR_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(CATEGORY_INDICATOR_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})

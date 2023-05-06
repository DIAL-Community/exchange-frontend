import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import { CREATE_CATEGORY_INDICATOR } from '../../../mutations/category-indicator'
import CategoryIndicatorForm from '../../../components/category-indicators/CategoryIndicatorForm'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import {
  createCategoryIndicatorFailure,
  createCategoryIndicatorSuccess,
  categoryIndicator,
  rubricCategory
} from './data/CategoryIndicatorForm'

mockNextUseRouter()

describe('Unit tests for CategoryIndicatorForm component.', () => {
  const CATEGORY_INDICATOR_NAME_TEST_ID = 'category-indicator-name'
  const CATEGORY_INDICATOR_WEIGHT_TEST_ID = 'category-indicator-weight'
  const CATEGORY_INDICATOR_INDICATOR_TYPE_TEST_ID = 'category-indicator-indicator-type'
  const CATEGORY_INDICATOR_INDICATOR_TYPE_OPTION_LABEL = 'numeric'
  const CATEGORY_INDICATOR_DESCRIPTION_TEST_ID = 'category-indicator-description'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should render CategoryIndicatorForm component for admin user.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container } = render(
      <CustomMockedProvider>
        <CategoryIndicatorForm rubricCategory={rubricCategory} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { getByTestId, getByText, container } = render(
      <CustomMockedProvider>
        <CategoryIndicatorForm rubricCategory={rubricCategory} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CATEGORY_INDICATOR_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_WEIGHT_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_INDICATOR_TYPE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test category indicator name')
    expect(getByTestId(CATEGORY_INDICATOR_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(CATEGORY_INDICATOR_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test category indicator name 2')
    expect(getByTestId(CATEGORY_INDICATOR_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_WEIGHT_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_INDICATOR_TYPE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Weight/), '1')
    expect(getByTestId(CATEGORY_INDICATOR_WEIGHT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() =>
      fireEvent.keyDown(
        getByTestId(CATEGORY_INDICATOR_INDICATOR_TYPE_TEST_ID).childNodes[1],
        { key: 'ArrowDown' }
      )
    )

    await waitFor(() => {
      fireEvent.click(getByText(CATEGORY_INDICATOR_INDICATOR_TYPE_OPTION_LABEL))
      expect(getByText(CATEGORY_INDICATOR_INDICATOR_TYPE_OPTION_LABEL)).toBeInTheDocument()
    })

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CATEGORY_INDICATOR_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_WEIGHT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CATEGORY_INDICATOR_INDICATOR_TYPE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(container).toMatchSnapshot()
  })

  describe('Should display toast on submit -', () => {
    test('Success.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const mockCreateCategoryIndicator = generateMockApolloData(
        CREATE_CATEGORY_INDICATOR,
        {
          slug: 'test_category_indicator',
          name: 'Test Category Indicator',
          rubricCategorySlug: 'rubric_category_slug',
          weight: 1,
          indicatorType: 'numeric',
          dataSource: 'Test data source',
          scriptName: 'Test script name',
          description: 'Test description'
        },
        null,
        createCategoryIndicatorSuccess
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateCategoryIndicator]} addTypename={false}>
          <CategoryIndicatorForm categoryIndicator={categoryIndicator} rubricCategory={rubricCategory} />
        </CustomMockedProvider>
      )

      await waitForAllEffectsAndSelectToLoad(container)
      await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
      expect(await screen.findByText('Category Indicator submitted successfully')).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('Failure.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const mockCreateCategoryIndicator = generateMockApolloData(
        CREATE_CATEGORY_INDICATOR,
        {
          slug: 'test_category_indicator',
          name: 'Test Category Indicator',
          weight: 1,
          indicatorType: 'numeric',
          dataSource: 'Test data source',
          scriptName: 'Test script name',
          description: 'Test description'
        },
        createCategoryIndicatorFailure
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateCategoryIndicator]}>
          <CategoryIndicatorForm categoryIndicator={categoryIndicator} />
        </CustomMockedProvider>
      )

      await waitForAllEffectsAndSelectToLoad(container)
      await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
      expect(await screen.findByText('Category Indicator submission failed')).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})

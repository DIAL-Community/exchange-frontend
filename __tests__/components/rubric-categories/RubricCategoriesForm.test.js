import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffects } from '../../test-utils'
import { CREATE_RUBRIC_CATEGORY } from '../../../mutations/rubric-category'
import RubricCategoryForm from '../../../components/rubric-categories/RubricCategoryForm'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { rubricCategory, createRubricCategorySuccess, createRubricCategoryFailure } from './data/RubricCategoryForm'

mockNextUseRouter()
describe('Unit tests for RubricCategoryForm component.', () => {
  const RUBRIC_CATEGORY_NAME_TEST_ID = 'rubric-category-name'
  const RUBRIC_CATEGORY_WEIGHT_TEST_ID = 'rubric-category-weight'
  const RUBRIC_CATEGORY_DESCRIPTION_TEST_ID = 'rubric-category-description'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should render RubricCategoryForm component for admin user.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { container } = render(
      <CustomMockedProvider>
        <RubricCategoryForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { getByTestId } = render(
      <CustomMockedProvider>
        <RubricCategoryForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(RUBRIC_CATEGORY_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(RUBRIC_CATEGORY_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(RUBRIC_CATEGORY_WEIGHT_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test rubric category name')
    expect(getByTestId(RUBRIC_CATEGORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await act(async () => waitFor(() => {
      user.clear(screen.getByLabelText(/Name/))
    }))
    expect(getByTestId(RUBRIC_CATEGORY_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test rubric category name 2')
    expect(getByTestId(RUBRIC_CATEGORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(RUBRIC_CATEGORY_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(RUBRIC_CATEGORY_WEIGHT_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Weight/), '1')
    expect(getByTestId(RUBRIC_CATEGORY_WEIGHT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(RUBRIC_CATEGORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(RUBRIC_CATEGORY_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(RUBRIC_CATEGORY_WEIGHT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  describe('Should display toast on submit -', () => {
    test('Success.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const mockCreateRubricCategory = generateMockApolloData(
        CREATE_RUBRIC_CATEGORY,
        {
          name: 'Test rubric category',
          slug: 'test_rubric_category',
          weight: 1,
          description: 'RC description'
        },
        null,
        createRubricCategorySuccess
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateRubricCategory]} addTypename={false}>
          <RubricCategoryForm rubricCategory={rubricCategory} />
        </CustomMockedProvider>
      )

      await waitForAllEffects()
      await act(async () => {
        fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      })
      await screen.findByText('Rubric Category submitted successfully')
      expect(container).toMatchSnapshot()
    })

    test('Failure.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const mockCreateRubricCategory = generateMockApolloData(
        CREATE_RUBRIC_CATEGORY,
        {
          name: 'Test rubric category',
          slug: 'test_rubric_category',
          weight: 1,
          description: 'RC description'
        },
        createRubricCategoryFailure
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateRubricCategory]}>
          <RubricCategoryForm rubricCategory={rubricCategory} />
        </CustomMockedProvider>
      )

      await waitForAllEffects()
      await act(async () => {
        fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      })
      await screen.findByText('Rubric Category submission failed')
      expect(container).toMatchSnapshot()
    })
  })
})

import { fireEvent, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForAllEffects
} from '../../test-utils'
import { CREATE_RUBRIC_CATEGORY } from '../../../mutations/rubric-category'
import RubricCategoryForm from '../../../components/rubric-categories/RubricCategoryForm'
import { rubricCategory, createRubricCategorySuccess, createRubricCategoryFailure } from './data/RubricCategoryForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for RubricCategoryForm component.', () => {
  const RUBRIC_CATEGORY_NAME_TEST_ID = 'rubric-category-name'
  const RUBRIC_CATEGORY_WEIGHT_TEST_ID = 'rubric-category-weight'
  const RUBRIC_CATEGORY_DESCRIPTION_TEST_ID = 'rubric-category-description'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should render RubricCategoryForm component for admin user.', async () => {
    mockSessionImplementation(true)
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
    mockSessionImplementation(true)
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
    await user.clear(screen.getByLabelText(/Name/))
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
      mockSessionImplementation(true)
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
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateRubricCategory]} addTypename={false}>
          <RubricCategoryForm rubricCategory={rubricCategory} />
        </CustomMockedProvider>
      )

      await waitForAllEffects()
      await act(async () => {
        fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
        await screen.findByText('Rubric category submitted successfully')
      })
    })

    test('Failure.', async () => {
      mockSessionImplementation(true)
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
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateRubricCategory]}>
          <RubricCategoryForm rubricCategory={rubricCategory} />
        </CustomMockedProvider>
      )

      await waitForAllEffects()
      await act(async () => {
        fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
        await screen.findByText('Rubric category submission failed')
      })
    })
  })
})

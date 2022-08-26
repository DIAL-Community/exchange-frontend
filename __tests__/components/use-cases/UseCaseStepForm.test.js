import { fireEvent, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  mockUnauthorizedUserSessionImplementation,
  render,
  waitForAllEffects,
} from '../../test-utils'
import StepForm from '../../../components/use-cases/steps/StepForm'
import { CREATE_USE_CASE_STEP } from '../../../mutations/use-case'
import {
  createUseCaseStepSuccess,
  useCaseStep,
  useCase
} from './data/UseCaseStepForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for UseCaseStepForm component.', () => {
  const USE_CASE_STEP_NAME_TEST_ID = 'use-case-step-name'
  const USE_CASE_STEP_DESCRIPTION_TEST_ID = 'use-case-step-description'
  const USE_CASE_STEP_STEP_NUMBER_TEST_ID = 'use-case-step-step-number'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockCreateUseCaseStepVariables = {
    name: 'Test Use Case Step',
    slug: 'test_use_case_step',
    stepNumber: 1,
    description: 'test Use Case Step description',
    useCaseId: 17
  }

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should render Unauthorized component for unauthorized user.', async () => {
    mockUnauthorizedUserSessionImplementation()
    const { container } = render(
      <CustomMockedProvider>
        <StepForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toHaveTextContent('You are not authorized to view this page')
  })

  test('Should render Unauthorized component for user who is not an admin.', async () => {
    mockSessionImplementation()
    const { container } = render(
      <CustomMockedProvider>
        <StepForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toHaveTextContent('You are not authorized to view this page')
  })

  test('Should render StepForm component for admin user.', async () => {
    mockSessionImplementation(true)
    const { container } = render(
      <CustomMockedProvider>
        <StepForm />
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
        <StepForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(USE_CASE_STEP_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_STEP_NUMBER_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test use case step name')
    expect(getByTestId(USE_CASE_STEP_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(USE_CASE_STEP_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test use case step name 2')
    expect(getByTestId(USE_CASE_STEP_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_STEP_NUMBER_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Step Number/), '1')
    expect(getByTestId(USE_CASE_STEP_STEP_NUMBER_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Step Number/))
    expect(getByTestId(USE_CASE_STEP_STEP_NUMBER_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Step Number/), '2')
    expect(getByTestId(USE_CASE_STEP_STEP_NUMBER_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(USE_CASE_STEP_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_STEP_STEP_NUMBER_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should display success toast on submit.', async () => {
    mockSessionImplementation(true)
    const mockCreateUseCaseStep = generateMockApolloData(
      CREATE_USE_CASE_STEP,
      mockCreateUseCaseStepVariables,
      null,
      createUseCaseStepSuccess
    )
    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreateUseCaseStep]}>
        <StepForm useCaseStep={useCaseStep} useCase={useCase}/>
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Use Case Step submitted successfully')
    })
  })

  test('Should display failure toast on submit.', async () => {
    mockSessionImplementation(true)
    const errorMessage = 'An error occurred'
    const mockCreateUseCaseStep = generateMockApolloData(
      CREATE_USE_CASE_STEP,
      mockCreateUseCaseStepVariables,
      new Error(errorMessage)
    )
    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreateUseCaseStep]}>
        <StepForm useCaseStep={useCaseStep} useCase={useCase}/>
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Use Case Step submission failed')
      await screen.findByText(errorMessage)
    })
  })
})

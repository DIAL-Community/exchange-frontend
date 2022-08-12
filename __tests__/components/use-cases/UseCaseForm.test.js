import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForAllEffects,
  waitForAllEffectsAndSelectToLoad
} from '../../test-utils'
import UseCaseForm from '../../../components/use-cases/UseCaseForm'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import { CREATE_USE_CASE } from '../../../mutations/use-case'
import { createUseCaseSuccess, sectors, useCase } from './data/UseCaseForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for UseCaseForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const USE_CASE_NAME_TEST_ID = 'use-case-name'
  const USE_CASE_SECTOR_TEST_ID = 'use-case-sector'
  const USE_CASE_MATURITY_TEST_ID = 'use-case-maturity'
  const USE_CASE_DESCRIPTION_TEST_ID = 'use-case-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockSectors = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)
  const mockCreateUseCaseVariables = {
    name: 'Test Use Case',
    slug: 'test_use_case',
    sectorSlug: 'test_sector',
    maturity: 'BETA',
    description: 'Test Use Case Description'
  }

  beforeAll(mockRouterImplementation)

  test('Should render Unauthorized component for unauthorized user.', async () => {
    mockSessionImplementation()
    const { container } = render(
      <CustomMockedProvider>
        <UseCaseForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - create.', async () => {
    mockSessionImplementation(true)
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <UseCaseForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - edit.', async () => {
    mockSessionImplementation(true)
    const { container } = render(
      <CustomMockedProvider>
        <UseCaseForm useCase={useCase} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields on submit.', async () => {
    mockSessionImplementation(true)
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <UseCaseForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    expect(getByTestId(USE_CASE_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_SECTOR_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_MATURITY_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_DESCRIPTION_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(USE_CASE_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_SECTOR_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_MATURITY_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields on submit and hide them on input value change.', async () => {
    mockSessionImplementation(true)
    const user = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <UseCaseForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(USE_CASE_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_SECTOR_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_MATURITY_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test user case name')
    expect(getByTestId(USE_CASE_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(USE_CASE_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test user case name 2')
    expect(getByTestId(USE_CASE_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(USE_CASE_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_SECTOR_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_MATURITY_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USE_CASE_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    expect(container).toMatchSnapshot()
  })

  test('Should display success toast on submit.', async () => {
    const mockCreateUseCase = generateMockApolloData(
      CREATE_USE_CASE,
      mockCreateUseCaseVariables,
      null,
      createUseCaseSuccess
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors, mockCreateUseCase]} addTypename={false}>
        <UseCaseForm useCase={useCase} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Use Case submitted successfully')
    })
  })

  test('Should display failure toast on submit.', async () => {
    mockSessionImplementation(true)
    const errorMessage = 'An error occurred'
    const mockCreateUseCase = generateMockApolloData(
      CREATE_USE_CASE,
      mockCreateUseCaseVariables,
      new Error(errorMessage)
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors, mockCreateUseCase]} addTypename={false}>
        <UseCaseForm useCase={useCase} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Use Case submission failed')
      await screen.findByText(errorMessage)
    })
  })
})

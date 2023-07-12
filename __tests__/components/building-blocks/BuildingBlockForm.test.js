import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffects, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import BuildingBlockForm from '../../../components/building-blocks/BuildingBlockForm'
import { CREATE_BUILDING_BLOCK } from '../../../mutations/building-block'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { buildingBlock, createBuildingBlockSuccess, createBuildingBlockFailure } from './data/BuildingBlockForm'

mockNextUseRouter()
describe('Unit tests for BuildingBlockForm component.', () => {
  const BUILDING_BLOCK_NAME_TEST_ID = 'building-block-name'
  const BUILDING_BLOCK_MATURITY_TEST_ID = 'building-block-maturity'
  const BUILDING_BLOCK_MATURITY_OPTION_LABEL = 'Draft'
  const BUILDING_BLOCK_DESCRIPTION_TEST_ID = 'building-block-description'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  describe('Should render Unauthorized component for', () => {
    test('unauthorized user.', async () => {
      mockNextAuthUseSession(statuses.UNAUTHENTICATED)
      const { container } = render(
        <CustomMockedProvider>
          <BuildingBlockForm />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      expect(container).toHaveTextContent('You are not authorized to view this page')
    })

    test('user who is not an admin.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: false })
      const { container } = render(
        <CustomMockedProvider>
          <BuildingBlockForm />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      expect(container).toHaveTextContent('You are not authorized to view this page')
    })
  })

  test('Should render BuildingBlockForm component for admin user.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container } = render(
      <CustomMockedProvider>
        <BuildingBlockForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider>
        <BuildingBlockForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(BUILDING_BLOCK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(BUILDING_BLOCK_MATURITY_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(BUILDING_BLOCK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test building block name')
    expect(getByTestId(BUILDING_BLOCK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(BUILDING_BLOCK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test building block name 2')
    expect(getByTestId(BUILDING_BLOCK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(BUILDING_BLOCK_MATURITY_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(BUILDING_BLOCK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.keyDown(getByTestId(BUILDING_BLOCK_MATURITY_TEST_ID).childNodes[1], { key: 'ArrowDown' }))
    await screen.findByText(BUILDING_BLOCK_MATURITY_OPTION_LABEL)

    await waitFor(() => {
      fireEvent.click(getByText(BUILDING_BLOCK_MATURITY_OPTION_LABEL))
      expect(getByText(BUILDING_BLOCK_MATURITY_OPTION_LABEL)).toBeInTheDocument()
    })

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(BUILDING_BLOCK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(BUILDING_BLOCK_MATURITY_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(BUILDING_BLOCK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  describe('Should display toast on submit -', () => {
    test('Success.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const mockCreateBuildingBlock = generateMockApolloData(
        CREATE_BUILDING_BLOCK,
        {
          name: 'Test Building Block',
          slug: 'test_buidling_block',
          maturity: 'DRAFT',
          category: 'DPI',
          specUrl: 'testbuidlingblock.com',
          description: '<p>test building block description</p>'
        },
        null,
        createBuildingBlockSuccess
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateBuildingBlock]} addTypename={false}>
          <BuildingBlockForm buildingBlock={buildingBlock} />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
      await screen.findByText('Building Block submitted successfully')
      expect(container).toMatchSnapshot()
    })

    test('Failure with graph error (non 200 status).', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const errorMessage = 'An error occurred'
      const mockCreateBuildingBlock = generateMockApolloData(
        CREATE_BUILDING_BLOCK,
        {
          name: 'Test Building Block',
          slug: 'test_buidling_block',
          maturity: 'DRAFT',
          category: 'DPI',
          specUrl: 'testbuidlingblock.com',
          description: '<p>test building block description</p>'
        },
        new Error(errorMessage)
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateBuildingBlock]}>
          <BuildingBlockForm buildingBlock={buildingBlock} />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
      await screen.findByText('Building Block submission failed')
      await screen.findByText(errorMessage)
      expect(container).toMatchSnapshot()
    })

    test('Failure with 200 status.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const mockCreateBuildingBlock = generateMockApolloData(
        CREATE_BUILDING_BLOCK,
        {
          name: 'Test Building Block',
          slug: 'test_buidling_block',
          maturity: 'DRAFT',
          category: 'DPI',
          specUrl: 'testbuidlingblock.com',
          description: '<p>test building block description</p>'
        },
        null,
        createBuildingBlockFailure
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateBuildingBlock]}>
          <BuildingBlockForm buildingBlock={buildingBlock} allowDebugMessage />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
      await screen.findByText('Building Block submission failed')
      expect(container).toMatchSnapshot()
    })
  })
})

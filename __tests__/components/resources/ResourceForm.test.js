import { act } from 'react-dom/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockObserverImplementation, waitForAllEffects, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import ResourceForm from '../../../components/resources/ResourceForm'
import { RESOURCES_SEARCH_QUERY } from '../../../queries/resource'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { resource, resources } from './data/ResourceDetail'

mockNextUseRouter()
describe('Unit tests for the ResourceForm component.', () => {
  const RESOURCE_NAME_TEST_ID = 'resource-name'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockedResources = generateMockApolloData(RESOURCES_SEARCH_QUERY, { search: '' }, null, resources)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot -', () => {
    test('create.', async () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockedResources]}>
          <ResourceForm resource={resource} />
        </CustomMockedProvider>
      )
      await waitForAllEffects(1000)
      expect(container).toMatchSnapshot()
    })
  })

  describe('For mandatory field -', () => {
    test('should show validation errors and hide one of them on input value change.', async () => {
      const user = userEvent.setup()
      const { container, getByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockedResources]}>
          <ResourceForm />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      await act(() => fireEvent.click(getByText('Submit Resource')))
      expect(getByTestId(RESOURCE_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

      await user.type(screen.getByLabelText(/Name/), 'test resource name')
      expect(getByTestId(RESOURCE_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
      expect(container).toMatchSnapshot()
    })
  })
})

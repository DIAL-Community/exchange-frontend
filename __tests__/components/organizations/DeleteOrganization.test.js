import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import DeleteOrganization from '../../../components/organizations/DeleteOrganization'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { DELETE_ORGANIZATION } from '../../../mutations/organization'
import { ORGANIZATION_QUERY } from '../../../queries/organization'
import { organization } from './data/OrganizationForm'

mockNextUseRouter()
describe('Unit tests for the OrganizationDelete component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { id: 1 }
  const deleteData = {
    data: {
      deleteOrganization: {
        organization: {
          id: 1,
          name: 'Test Organization',
          slug: 'test_organization'
        },
        errors: []
      }
    }
  }
  const mockDelete = generateMockApolloData(DELETE_ORGANIZATION, deleteVars, null, deleteData)

  const organizationVars = { slug: 'test_organization' }
  const organizationData = { data: { organization: null } }
  const mockOrganization = generateMockApolloData(ORGANIZATION_QUERY, organizationVars, null, organizationData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteOrganization organization={organization}/>
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close ConfirmActionDialog', () => {
    test('after clicks "Cancel" button.', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteOrganization organization={organization}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockOrganization]}>
          <DeleteOrganization organization={organization}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})

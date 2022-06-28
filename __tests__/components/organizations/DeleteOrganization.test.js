import { fireEvent, waitFor } from '@testing-library/react'
import DeleteOrganization from '../../../components/organizations/DeleteOrganization'
import { mockRouterImplementation, mockSessionImplementation, render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { organization } from './data/OrganizationForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit tests for the OrganizationDelete component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation(true)
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <DeleteOrganization organization={organization}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(container).toMatchSnapshot()
  })
    
  test('Should close ConfirmActionDialog after clicks "Cancel" button.', () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <DeleteOrganization organization={organization}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))    
    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(container).toMatchSnapshot()
  })
    
  test('Should close ConfirmActionDialog after clicks "Confirm" button', async () => {
    const { getByTestId, queryByTestId } = render(
      <CustomMockedProvider>
        <DeleteOrganization organization={organization}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))
   
    await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
  })
})
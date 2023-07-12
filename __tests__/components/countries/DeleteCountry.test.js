import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import DeleteCountry from '../../../components/countries/DeleteCountry'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { DELETE_COUNTRY } from '../../../mutations/country'
import { COUNTRY_DETAIL_QUERY } from '../../../queries/country'
import { country } from './data/DeleteCountry'

mockNextUseRouter()
describe('Unit tests for the CountryDelete component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { id: 1 }
  const deleteData = {
    data: {
      deleteCountry: {
        country: {
          id: 1,
          name: 'country',
          slug: 'country'
        },
        errors: []
      }
    }
  }
  const mockDelete = generateMockApolloData(DELETE_COUNTRY, deleteVars, null, deleteData)

  const countryVars = { slug: 'country' }
  const countryData = { data: { country: null } }
  const mockCountry = generateMockApolloData(COUNTRY_DETAIL_QUERY, countryVars, null, countryData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteCountry country={country}/>
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
          <DeleteCountry country={country}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockCountry]}>
          <DeleteCountry country={country}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})

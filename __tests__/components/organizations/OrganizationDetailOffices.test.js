import { fireEvent, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import OrganizationDetailOffices from '../../../components/organizations/OrganizationDetailOffices'
import { mockArcGisToken, render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { COUNTRY_CODES_QUERY } from '../../../queries/country'
import { countries } from './data/GeocodeAutocomplete'
import { organization } from './data/OrganizationForm'

mockNextUseRouter()
describe('Unit test for the OrganizationDetailOffices component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockCountries = generateMockApolloData(COUNTRY_CODES_QUERY, { search: '' }, null, countries)

  beforeAll(() => {
    mockArcGisToken()
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
  })

  describe('Should match snapshot', () => {
    test('without edit permission.', () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockCountries]}>
          <OrganizationDetailOffices
            canEdit={false}
            organization={organization}
          />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })

    test('with edit permission.', () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockCountries]}>
          <OrganizationDetailOffices
            canEdit={true}
            organization={organization}
          />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })

    test('with open editable section', async () => {
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCountries]}>
          <OrganizationDetailOffices
            canEdit={true}
            organization={organization}
          />
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID)))
      await waitForAllEffectsAndSelectToLoad(container)
      expect(container).toMatchSnapshot()
    })
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <OrganizationDetailOffices
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)
    await act(() => fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID)))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
  })
})

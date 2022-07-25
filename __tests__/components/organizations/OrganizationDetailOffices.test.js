import { fireEvent, screen } from '@testing-library/react'
import OrganizationDetailOffices from '../../../components/organizations/OrganizationDetailOffices'
import {
  mockArcGisToken,
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForReactSelectToLoad
} from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { organization } from './data/OrganizationForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the OrganizationDetailOffices component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'

  beforeAll(() => {
    mockArcGisToken()
    mockRouterImplementation()
    mockSessionImplementation()
  })

  describe('Should match snapshot', () => {
    test('without edit permission.', () => {
      const { container } = render(
        <CustomMockedProvider>
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
        <CustomMockedProvider>
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
        <CustomMockedProvider>
          <OrganizationDetailOffices
            canEdit={true}
            organization={organization}
          />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
      await waitForReactSelectToLoad(container)
      expect(container).toMatchSnapshot()
    })
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <OrganizationDetailOffices
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForReactSelectToLoad(container)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
  })
})

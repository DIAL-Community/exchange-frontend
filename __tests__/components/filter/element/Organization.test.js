import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { ORGANIZATION_SEARCH_QUERY } from '../../../../queries/organization'
import { OrganizationAutocomplete } from '../../../../components/filter/element/Organization'
import { organizations } from './data/OrganizationAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the OrganizationAutocomplete component.', () => {
  const mockOrganizations = generateMockApolloData(ORGANIZATION_SEARCH_QUERY, { search: '' }, null, organizations)
  const ORGANIZATION_SEARCH_TEST_ID = 'organization-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <OrganizationAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <OrganizationAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(ORGANIZATION_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })
    
    expect(container).toHaveTextContent('Another Organization')
    expect(container).toMatchSnapshot()
  })
})

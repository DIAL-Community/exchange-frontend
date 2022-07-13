import {
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { ORGANIZATION_SEARCH_QUERY } from '../../../../queries/organization'
import { OrganizationAutocomplete } from '../../../../components/filter/element/Organization'
import { organizations } from './data/OrganizationAutocomplete'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the OrganizationAutocomplete component.', () => {
  const mockOrganizations = generateMockApolloData(ORGANIZATION_SEARCH_QUERY, { search: '' }, null, organizations)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - with edit permission.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <OrganizationAutocomplete
          organizations={organizations}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })
})

import { fireEvent } from '@testing-library/dom'
import { render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { CapabilityAutocomplete } from '../../../../components/filter/element/Capability'
import { CAPABILITY_SEARCH_QUERY } from '../../../../queries/capability'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { capabilityOnly } from './data/CapabilityAutocomplete'

mockNextUseRouter()
describe('Unit test for the CapabilityAutocomplete component.', () => {
  const mockServices = generateMockApolloData(CAPABILITY_SEARCH_QUERY, { search: '' }, null, capabilityOnly)
  const CAPABILITY_SEARCH_TEST_ID = 'service-search'

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockServices]}>
        <CapabilityAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockServices]}>
        <CapabilityAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(CAPABILITY_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('Services 1')
    expect(container).toHaveTextContent('Services 2')
    expect(container).toMatchSnapshot()
  })
})

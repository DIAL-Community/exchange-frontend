import { fireEvent } from '@testing-library/dom'
import { render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { UseCaseAutocomplete } from '../../../../components/filter/element/UseCase'
import { USE_CASE_SEARCH_QUERY } from '../../../../queries/use-case'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { useCases } from './data/UseCaseAutocomplete'

mockNextUseRouter()
describe('Unit test for the UseCaseAutocomplete component.', () => {
  const mockUseCases = generateMockApolloData(USE_CASE_SEARCH_QUERY, { search: '', mature: true }, null, useCases)
  const USE_CASE_SEARCH_TEST_ID = 'use-case-search'

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockUseCases]}>
        <UseCaseAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockUseCases]}>
        <UseCaseAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(USE_CASE_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('UseCase 1')
    expect(container).toHaveTextContent('UseCase 2')
    expect(container).toMatchSnapshot()
  })
})

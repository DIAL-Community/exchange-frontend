import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider from '../../../utils/CustomMockedProvider'
import { EndorsingYearSelect } from '../../../../components/filter/element/EndorsingYear'
import { years } from './data/EndorsingYearSelect'

jest.mock('next/dist/client/router')

describe('Unit test for the EndorsingYearSelect component.', () => {
  const ENDORSING_YEAR_SEARCH_TEST_ID = 'endorsing-year-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot.', async () => {
    const { container } = render(
      <CustomMockedProvider>
        <EndorsingYearSelect
          years={years}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <EndorsingYearSelect
          years={years}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(ENDORSING_YEAR_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })
    
    expect(container).toHaveTextContent('2015')
    expect(container).toHaveTextContent('2016')
    expect(container).toMatchSnapshot()
  })
})

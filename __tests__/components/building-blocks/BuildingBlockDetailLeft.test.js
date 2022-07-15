import { DiscourseProvider } from '../../../components/context/DiscourseContext'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import BuildingBlockDetailLeft from '../../../components/building-blocks/BuildingBlockDetailLeft'
import { buildingBlock } from './data/BuildingBlockForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the BuildingBlockDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockSessionImplementation()

    const { queryByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockSessionImplementation(true)

    const { getByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to buildingBlock edit form', () => {
    mockSessionImplementation(true)

    const { getByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/building_blocks/${buildingBlock.slug}/edit`)
  })
})

import { act } from 'react-dom/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { SDG_TARGET_SEARCH_QUERY } from '../../../queries/sdg-target'
import UseCaseDetailSdgTargets from '../../../components/use-cases/UseCaseDetailSdgTargets'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { useCase } from './data/UseCaseForm'
import { sdgTargets } from './data/UseCaseDetailSdgTargets'

mockNextUseRouter()
describe('Unit tests for the ProductDetailSdgTargets component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const SDG_TARGETS_SEARCH_TEST_ID = 'sdg-targets-search'
  const SDG_TARGETS_SEARCH_OPTION_1_LABEL = '1.1. Test SDG Target...'
  const SDG_TARGETS_SEARCH_OPTION_2_LABEL = '2.1. Another SDG Target...'
  const USECASE_TEST_SDG_TARGETS_LABEL = 'Another SDG Target'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockSdgTargets = generateMockApolloData(SDG_TARGET_SEARCH_QUERY, { search: '' }, null, sdgTargets)

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSdgTargets]}>
        <UseCaseDetailSdgTargets
          canEdit={false}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSdgTargets]}>
        <UseCaseDetailSdgTargets
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSdgTargets]}>
        <UseCaseDetailSdgTargets
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId, getAllByTestId } = render(
      <CustomMockedProvider mocks={[mockSdgTargets]}>
        <UseCaseDetailSdgTargets
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)

    await act(() => fireEvent.click(getAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)[0]))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockSdgTargets]}>
        <UseCaseDetailSdgTargets
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)

    await act(() => fireEvent.keyDown(getByTestId(SDG_TARGETS_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' }))
    await screen.findByText(SDG_TARGETS_SEARCH_OPTION_1_LABEL)
    await act(() => fireEvent.click(getByText(SDG_TARGETS_SEARCH_OPTION_1_LABEL)))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    expect(container).toMatchSnapshot()

    await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
    expect(screen.queryByText(USECASE_TEST_SDG_TARGETS_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SDG_TARGETS_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SDG_TARGETS_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()

    await act(() => fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(SDG_TARGETS_SEARCH_OPTION_2_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SDG_TARGETS_SEARCH_OPTION_1_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(USECASE_TEST_SDG_TARGETS_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
  })
})

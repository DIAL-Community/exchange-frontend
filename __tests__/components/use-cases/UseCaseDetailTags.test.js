import { fireEvent, screen } from '@testing-library/react'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { TAG_SEARCH_QUERY } from '../../../queries/tag'
import UseCaseDetailTags from '../../../components/use-cases/UseCaseDetailTags'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { tags } from './data/UseCaseDetailTags'
import { useCase } from './data/UseCaseForm'

mockNextUseRouter()
describe('Unit test for the UseCaseDetailTags component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const TAGS_SEARCH_TEST_ID = 'tag-search'
  const TAGS_SEARCH_OPTION_LABEL = 'Another Tag'
  const USE_CASE_TEST_TAG_LABEL = 'Test Tag'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockTags = generateMockApolloData(TAG_SEARCH_QUERY, { search: '' }, null, tags)

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <UseCaseDetailTags
          canEdit={false}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <UseCaseDetailTags
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <UseCaseDetailTags
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <UseCaseDetailTags
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <UseCaseDetailTags
          canEdit={true}
          useCase={useCase}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(TAGS_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(TAGS_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(TAGS_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(USE_CASE_TEST_TAG_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(TAGS_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(USE_CASE_TEST_TAG_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(TAGS_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})

import { FilterContextProvider } from '../../../components/context/FilterContext'
import SearchFilter from '../../../components/shared/SearchFilter'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { products, projects } from './data/SearchFilter'
import { organizationOwnerUserProps, productOwnerUserProps } from './data/Users'

mockNextUseRouter()
describe('Unit test for the SearchFilter component in Products tab.', () => {
  const CREATE_NEW_LINK_TEST_ID = 'create-new'

  test('Should "Create New" link not be visible for unauthorized user', () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)

    const { queryByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={products.resultCounts}>
          <SearchFilter hint={products.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(queryByTestId(CREATE_NEW_LINK_TEST_ID)).toBeNull()
  })

  test('Should "Create New" link be visible for authorized user', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={products.resultCounts}>
          <SearchFilter hint={products.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect authorized user to candidate product form after clicking "Create New" link', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={products.resultCounts}>
          <SearchFilter hint={products.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toHaveAttribute('href', '/candidate/products/create')
  })

  test('Should redirect user with admin/edit privileges to product form after clicking "Create New" link', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={products.resultCounts}>
          <SearchFilter hint={products.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toHaveAttribute('href', '/products/create')
  })
})

mockNextUseRouter()
describe('Unit test for the SearchFilter component in Projects tab.', () => {
  const CREATE_NEW_LINK_TEST_ID = 'create-new'

  test('Should "Create New" link not be visible for unauthorized user', () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
    const { queryByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={projects.resultCounts}>
          <SearchFilter hint={projects.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(queryByTestId(CREATE_NEW_LINK_TEST_ID)).toBeNull()
  })

  test('Should "Create New" link be visible for admin user.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={projects.resultCounts}>
          <SearchFilter hint={projects.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toBeInTheDocument()
  })

  test('Should "Create New" link be visible for Organization owner.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, organizationOwnerUserProps)
    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={projects.resultCounts}>
          <SearchFilter hint={projects.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toBeInTheDocument()
  })

  test('Should "Create New" link be visible for Product owner.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, productOwnerUserProps)
    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={projects.resultCounts}>
          <SearchFilter hint={projects.hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toBeInTheDocument()
  })
})

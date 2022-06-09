import { useSession } from 'next-auth/client'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import SearchFilter from '../../../components/shared/SearchFilter'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { hint, resultCounts } from './data/SearchFilter'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the SearchFilter component.', () => {
  const CREATE_NEW_LINK_TEST_ID = 'create-new'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should "Create New" link not be visible for unauthorized user', () => {
    useSession.mockReturnValue([false])
    
    const { queryByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={resultCounts}>
          <SearchFilter hint={hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )
    
    expect(queryByTestId(CREATE_NEW_LINK_TEST_ID)).toBeNull()
  })

  test('Should "Create New" link be visible for authorized user', () => {
    mockSessionImplementation()

    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={resultCounts}>
          <SearchFilter hint={hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )
    
    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect authorized user to candidate product form after clicking "Create New" link', () => {
    mockSessionImplementation()
    
    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={resultCounts}>
          <SearchFilter hint={hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )
    
    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toHaveAttribute('href', '/candidate/products/create')
  })

  test('Should redirect user with admin/edit privileges to product form after clicking "Create New" link', () => {
    mockSessionImplementation(true)
    
    const { getByTestId } = render(
      <CustomMockedProvider>
        <FilterContextProvider resultCounts={resultCounts}>
          <SearchFilter hint={hint} />
        </FilterContextProvider>
      </CustomMockedProvider>
    )
    
    expect(getByTestId(CREATE_NEW_LINK_TEST_ID)).toHaveAttribute('href', '/products/create')
  })
})

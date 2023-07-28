import { render } from '../../test-utils'
import UserDetail from '../../../components/users/UserDetail'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { basicUser, user, userWithProducts } from './data/UserDetail'

mockNextUseRouter()
describe('Unit test for the UserDetail component', () => {
  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
  })

  test('should not render 0 for user not owning any product.', () => {
    const component = render(
      <CustomMockedProvider>
        <UserDetail user={user} />
      </CustomMockedProvider>)

    // Should not display the products section.
    expect(component.queryByText(/0/)).not.toBeInTheDocument()
    expect(component.queryByText(/Products/)).not.toBeInTheDocument()
    // Should display the role
    expect(component.getByText(/ORG_USER/)).toBeInTheDocument()
    // Should display the organization name.
    expect(component.getByText(/Some Organization/)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  test('should render element of the user owning product.', () => {
    const component = render(
      <CustomMockedProvider>
        <UserDetail user={userWithProducts} />
      </CustomMockedProvider>)

    // Should correctly format both roles.
    expect(component.getByText(/ORG_USER, PRODUCT_USER/)).toBeInTheDocument()

    // Should display both the organization and product name.
    expect(component.getByText(/Some Organization/)).toBeInTheDocument()
    expect(component.getByText(/Some Product/)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  test('should render element of basic user not owning product or organization.', () => {
    const component = render(
      <CustomMockedProvider>
        <UserDetail user={basicUser} />
      </CustomMockedProvider>)

    expect(component.getByText(/USER/)).toBeInTheDocument()
    // Should not display the products and organizations section.
    expect(component.queryByText(/Products/)).not.toBeInTheDocument()
    expect(component.queryByText(/Organization/)).not.toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})

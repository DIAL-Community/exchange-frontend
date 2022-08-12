import { useSession } from 'next-auth/client'
import OrganizationDetailLeft from '../../../components/organizations/OrganizationDetailLeft'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { organization } from './data/OrganizationForm'
import { user } from './data/OrganizationOwner'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit tests for the OrganizationDetailLeft component.', () => {

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot - unauthorized user.', () => {
    mockSessionImplementation(false)
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - user is organization owner.', () => {
    useSession.mockReturnValue([{ user: { user } }, false])
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - user is admin.', () => {
    mockSessionImplementation(true)
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

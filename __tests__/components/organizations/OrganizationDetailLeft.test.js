import { useSession } from 'next-auth/react'
import OrganizationDetailLeft from '../../../components/organizations/OrganizationDetailLeft'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { organization } from './data/OrganizationForm'
import { user } from './data/OrganizationOwner'

mockNextUseRouter()
describe('Unit tests for the OrganizationDetailLeft component.', () => {

  test('Should match snapshot - unauthorized user.', () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
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
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

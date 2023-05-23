import { useSession } from 'next-auth/react'
import OrganizationDetailLeft from '../../../components/organizations/OrganizationDetailLeft'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { COMMENTS_COUNT_QUERY } from '../../../queries/comment'
import { CANDIDATE_ROLE_QUERY } from '../../../queries/candidate'
import { organization } from './data/OrganizationForm'
import { user } from './data/OrganizationOwner'

mockNextUseRouter()
describe('Unit tests for the OrganizationDetailLeft component.', () => {
  const commentVars = { commentObjectId: 1, commentObjectType: 'ORGANIZATION' }
  const commentData = { 'data': { 'countComments': 0 } }
  const mockComment = generateMockApolloData(COMMENTS_COUNT_QUERY, commentVars, null, commentData)

  const candidateRoleVars = {
    email: 'some-fake@email.com',
    productId: '',
    datasetId: '',
    organizationId: 1
  }
  const candidateRoleData = {
    data: {
      candidateRole: null
    }
  }
  const mockCandidateRole = generateMockApolloData(CANDIDATE_ROLE_QUERY, candidateRoleVars, null, candidateRoleData)

  test('Should match snapshot - unauthorized user.', () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider mocks={[mockComment, mockCandidateRole]}>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - user is organization owner.', () => {
    useSession.mockReturnValue([{ user: { user } }, false])
    const { container } = render(
      <CustomMockedProvider mocks={[mockComment, mockCandidateRole]}>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - user is admin.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container } = render(
      <CustomMockedProvider mocks={[mockComment, mockCandidateRole]}>
        <OrganizationDetailLeft organization={organization}/>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

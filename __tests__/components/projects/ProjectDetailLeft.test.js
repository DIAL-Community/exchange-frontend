import ProjectDetailLeft from '../../../components/projects/ProjectDetailLeft'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { project } from './data/ProjectForm'

mockNextUseRouter()
describe('Unit test for the ProjectDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  test('Should Edit button not be visible for user who is neither an admin, nor Organization owner, nor Product owner.', () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
    const { queryByTestId } = render(
      <CustomMockedProvider>
        <ProjectDetailLeft project={project} />
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for authorized user.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProjectDetailLeft
          project={project}
          canEdit={true}
        />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Edit button should to have specific href attribute.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProjectDetailLeft
          project={project}
          canEdit={true}
        />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/en/projects/${project.slug}/edit`)
  })
})

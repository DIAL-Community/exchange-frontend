import { DiscourseProvider } from '../../../components/context/DiscourseContext'
import ProjectDetailLeft from '../../../components/projects/ProjectDetailLeft'
import { mockRouterImplementation, mockSessionImplementation, mockUnauthorizedUserSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { project } from './data/ProjectForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the ProjectDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should Edit button not be visible for user who is neither an admin, nor Organization owner, nor Product owner.', () => {
    mockUnauthorizedUserSessionImplementation()
    const { queryByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <ProjectDetailLeft project={project} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for authorized user.', async () => {
    mockSessionImplementation()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <ProjectDetailLeft
            project={project}
            canEdit={true}
          />
        </DiscourseProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Edit button should to have specific href attribute.', () => {
    mockSessionImplementation()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <ProjectDetailLeft
            project={project}
            canEdit={true}
          />
        </DiscourseProvider>
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/en/projects/${project.slug}/edit`)
  })
})

import { fireEvent, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  mockUnauthorizedUserSessionImplementation,
  render,
  waitForAllEffects,
  waitForAllEffectsAndSelectToLoad
} from '../../test-utils'
import ProjectForm from '../../../components/projects/ProjectForm'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import { OWNED_PRODUCTS_QUERY, PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { CREATE_PROJECT } from '../../../mutations/project'
import {
  createProjectSuccess,
  organizationAndProductOwnerUserProps,
  organizationOwnerUserProps,
  organizations,
  ownedProducts,
  productOwnerUserProps,
  products,
  project
} from './data/ProjectForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for ProjectForm component.', () => {
  const PROJECT_NAME_TEST_ID = 'project-name'
  const PROJECT_DESCRIPTION_TEST_ID = 'project-description'
  const PROJECT_ORGANIZATION_TEST_ID = 'project-organization'
  const PROJECT_PRODUCT_TEST_ID = 'project-product'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockOrganizations = generateMockApolloData(ORGANIZATION_SEARCH_QUERY, { search: '' }, null, organizations)
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)
  const mockOwnedProducts = generateMockApolloData(OWNED_PRODUCTS_QUERY, null, null, ownedProducts)

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should render Unauthorized component for unauthorized user.', async () => {
    mockUnauthorizedUserSessionImplementation()
    const { container } = render(
      <CustomMockedProvider>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toHaveTextContent('You are not authorized to view this page')
  })

  test('Should render Unauthorized component for user who is neither an admin, nor Organization owner, nor Product owner.', async () => {
    mockSessionImplementation()
    const { container } = render(
      <CustomMockedProvider>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toHaveTextContent('You are not authorized to view this page')
  })

  test('Should render ProjectForm component for admin user.', async () => {
    mockSessionImplementation(true)
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations, mockProducts]} addTypename={false}>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(PROJECT_ORGANIZATION_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    fireEvent.keyDown(getByTestId(PROJECT_PRODUCT_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    expect(container).toMatchSnapshot()
  })

  test('Should render ProjectForm component for Organization owner with read-only input for Organization and no select for Product.', async () => {
    mockSessionImplementation(false, organizationOwnerUserProps)
    const { container } = render(
      <CustomMockedProvider>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render ProjectForm component for Product owner with select for Product and no select for Organization.', async () => {
    mockSessionImplementation(false, productOwnerUserProps)
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOwnedProducts]} addTypename={false}>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(PROJECT_PRODUCT_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    expect(container).toMatchSnapshot()
  })

  test('Should render ProjectForm component for Organization and Product owner with read-only input for Organization and select for Product.', async () => {
    mockSessionImplementation(false, organizationAndProductOwnerUserProps)
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockOwnedProducts]} addTypename={false}>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PROJECT_PRODUCT_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    fireEvent.keyDown(getByTestId(PROJECT_PRODUCT_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText('Product 1')
    fireEvent.click(getByText('Product 1'))

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PROJECT_PRODUCT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    mockSessionImplementation(true)
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts]} addTypename={false}>
        <ProjectForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PROJECT_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PROJECT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test project name')
    expect(getByTestId(PROJECT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(PROJECT_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test project name 2')
    expect(getByTestId(PROJECT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PROJECT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PROJECT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PROJECT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should display success toast on submit.', async () => {
    mockSessionImplementation(true)
    const mockCreateProject = generateMockApolloData(
      CREATE_PROJECT,
      {
        name: 'Test Project',
        slug: 'test_project',
        startDate: '2000-01-01',
        endDate: '2001-01-01',
        projectUrl: 'testproject.com',
        description: '<p>test project description</p>'
      },
      null,
      createProjectSuccess
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations, mockProducts, mockCreateProject]} addTypename={false}>
        <ProjectForm project={project} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Project submitted successfully')
    })
  })

  test('Should display failure toast on submit.', async () => {
    mockSessionImplementation(true)
    const errorMessage = 'An error occurred'
    const mockCreateProject = generateMockApolloData(
      CREATE_PROJECT,
      {
        name: 'Test Project',
        slug: 'test_project',
        startDate: '2000-01-01',
        endDate: '2001-01-01',
        projectUrl: 'testproject.com',
        description: '<p>test project description</p>'
      },
      new Error(errorMessage)
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations, mockProducts, mockCreateProject]}>
        <ProjectForm project={project} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Project submission failed')
      await screen.findByText(errorMessage)
    })
  })
})

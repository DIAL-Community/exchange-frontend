import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { UPDATE_PRODUCT_REPOSITORY } from '../../../../mutations/product'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  render
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import RepositoryForm from '../../../../components/products/repositories/RepositoryForm'
import {
  productRepository,
  productSlug,
  updateProductRepositorySuccess,
  productRepositoryVariables
} from './data/RepositoryForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('RepositoryForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const PRODUCT_REPOSITORY_NAME_TEST_ID = 'product-repository-name'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  describe('Should match snapshot:', () => {
    mockSessionImplementation(true)
    test('Create.', () => {
      const { container } = render(
        <CustomMockedProvider>
          <RepositoryForm productSlug={productSlug} />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })

    test('Edit.', () => {
      mockSessionImplementation(true)
      const { container } = render(
        <CustomMockedProvider>
          <RepositoryForm productRepository={productRepository} productSlug={productSlug} />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <RepositoryForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Name/), 'test repository name')
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <RepositoryForm />
      </CustomMockedProvider>
    )
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test repository name')
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test repository name 2')
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    expect(getByTestId(PRODUCT_REPOSITORY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
  
  test('Should display success toast on submit.', async () => {
    const mockUpdateProductRepository = generateMockApolloData(
      UPDATE_PRODUCT_REPOSITORY,
      productRepositoryVariables,
      null,
      updateProductRepositorySuccess
    )
    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockUpdateProductRepository]}>
        <RepositoryForm productRepository={productRepository} productSlug={productSlug} />
      </CustomMockedProvider>
    )
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      await screen.findByText('Repository submitted successfully')
    })
  })
})

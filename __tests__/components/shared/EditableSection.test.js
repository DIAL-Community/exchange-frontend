import { fireEvent, screen } from '@testing-library/react'
import EditableSection from '../../../components/shared/EditableSection'
import { mockRouterImplementation, render } from '../../test-utils'

// Mock next-router calls.
jest.mock('next/dist/client/router')

describe('Unit test for the Editable Section component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const SUBMIT_SPINNER_TEST_ID = 'submit-spinner'
  const mockSectionHeader = 'Mock Section Header'
  const mockEditModeBody = 'edit mode body'
  const mockDisplayModeBody = 'display mode body'
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeAll(mockRouterImplementation)

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <EditableSection
        canEdit={false}
        sectionHeader={mockSectionHeader}
        editModeBody={mockEditModeBody}
        displayModeBody={mockDisplayModeBody}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <EditableSection
        canEdit={true}
        sectionHeader={mockSectionHeader}
        editModeBody={mockEditModeBody}
        displayModeBody={mockDisplayModeBody}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('Should switch to edit mode and back to display mode on "Cancel" button click.', () => {
    const { container, getByTestId } = render(
      <EditableSection
        canEdit={true}
        sectionHeader={mockSectionHeader}
        editModeBody={mockEditModeBody}
        displayModeBody={mockDisplayModeBody}
        onCancel={mockOnCancel}
      />
    )
    expect(screen.getByText(mockDisplayModeBody)).toBeInTheDocument()
    expect(screen.queryByText(mockEditModeBody)).toBeNull()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    expect(screen.queryByText(mockDisplayModeBody)).toBeNull()
    expect(screen.getByText(mockEditModeBody)).toBeInTheDocument()
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(mockOnCancel).toBeCalled()
    expect(screen.getByText(mockDisplayModeBody)).toBeInTheDocument()
    expect(screen.queryByText(mockEditModeBody)).toBeNull()
  })

  test('Should "Submit" button be disabled if no changes are made.', () => {
    const { getByTestId } = render(
      <EditableSection
        canEdit={true}
        sectionHeader={mockSectionHeader}
        editModeBody={mockEditModeBody}
        displayModeBody={mockDisplayModeBody}
        isDirty={false}
        onSubmit={mockOnSubmit}
      />
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    const submitButton = getByTestId(SUBMIT_BUTTON_TEST_ID)
    expect(submitButton).toBeDisabled()
    fireEvent.click(submitButton)
    expect(mockOnSubmit).not.toBeCalled()
  })

  test('Should "Submit" button be enabled when changes are made.', () => {
    const { getByTestId } = render(
      <EditableSection
        canEdit={true}
        sectionHeader={mockSectionHeader}
        editModeBody={mockEditModeBody}
        displayModeBody={mockDisplayModeBody}
        isDirty={true}
        onSubmit={mockOnSubmit}
      />
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    const submitButton = getByTestId(SUBMIT_BUTTON_TEST_ID)
    expect(submitButton).not.toBeDisabled()
    fireEvent.click(submitButton)
    expect(mockOnSubmit).toBeCalled()
  })

  test('Should "Submit" button become disabled and spinner should appear on "Submit" button click.', () => {
    const { getByTestId } = render(
      <EditableSection
        canEdit={true}
        sectionHeader={mockSectionHeader}
        editModeBody={mockEditModeBody}
        displayModeBody={mockDisplayModeBody}
        isDirty={true}
        isMutating={true}
        onSubmit={mockOnSubmit}
      />
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    expect(getByTestId(SUBMIT_BUTTON_TEST_ID)).toHaveTextContent('Submit')
    expect(screen.queryByTestId(SUBMIT_SPINNER_TEST_ID)).toBeNull()

    fireEvent.click(getByTestId(SUBMIT_BUTTON_TEST_ID))
    expect(mockOnSubmit).toBeCalled()
    expect(getByTestId(SUBMIT_BUTTON_TEST_ID)).toHaveTextContent('Submitting')
    expect(screen.queryByTestId(SUBMIT_SPINNER_TEST_ID)).toBeInTheDocument()
  })
})

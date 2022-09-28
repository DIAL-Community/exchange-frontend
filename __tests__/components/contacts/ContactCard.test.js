import '@testing-library/react'
import { render } from '../../test-utils'
import ContactCard from '../../../components/contacts/ContactCard'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

const mockContactData =
  {
    name: 'Example Name',
    email: 'example@example.com',
    title: 'example title'
  }

mockNextUseRouter()
describe('Unit test for the contact card', () => {
  test('Check contact card will display name, email, title on "list" mode.', () => {

    const component = render(<ContactCard contact={mockContactData} listType="list" />)

    expect(component.getByTestId('contactName')).toHaveTextContent(mockContactData.name)
    expect(component.getByTestId('contactEmail')).toHaveTextContent(mockContactData.email)
    expect(component.getByTestId('contactTitle')).toHaveTextContent(mockContactData.title)
    expect(component.getByTestId('contactName')).toHaveClass('inline-block font-semibold text-button-gray')
    expect(component.getByTestId('contactEmail')).toHaveClass('inline-block font-semibold text-button-gray')
    expect(component.getByTestId('contactTitle')).toHaveClass('inline-block font-semibold text-button-gray')
    expect(component.getByTestId('nameLabel')).toHaveTextContent('Name')
    expect(component.getByTestId('emailLabel')).toHaveTextContent('Email')
    expect(component.getByTestId('titleLabel')).toHaveTextContent('Title')
    // queryByTestId() returns the matching node for a query, and return null if no elements match
    expect(component.queryByTestId('contactLabel')).toBeNull()
  })

  test('Check contact card will NOT display name, email, title on "null" mode.', ()=> {

    const component = render(<ContactCard contact={mockContactData} listType="" />)

    // queryByTestId() returns the matching node for a query, and return null if no elements match
    expect(component.queryByTestId('contactName')).toBeNull()
    expect(component.queryByTestId('contactEmail')).toBeNull()
    expect(component.queryByTestId('contactTitle')).toBeNull()
    expect(component.queryByTestId('nameLabel')).toBeNull()
    expect(component.queryByTestId('emailLabel')).toBeNull()
    expect(component.queryByTestId('titleLabel')).toBeNull()
    expect(component.getByTestId('contactLabel')).toHaveTextContent('Contact')
  })

})

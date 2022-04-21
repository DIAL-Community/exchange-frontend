import { useRouter } from 'next/router'
import { render } from '@testing-library/react'
import CityCard from '../../../components/cities/CityCard'

// Mock next-router calls.
jest.mock('next/dist/client/router')

describe('Unit test for the city card.', () => {
  beforeEach(() => {
    // Mocked router implementation.
    useRouter.mockImplementation(() => ({
      asPath: '/',
      locale: 'en',
      push: jest.fn(() => Promise.resolve(true)),
      prefetch: jest.fn(() => Promise.resolve(true)),
      events: {
        on: jest.fn(),
        off: jest.fn()
      }
    }))
  })

  test('Check city card will display name on list mode.', () => {
    const city = {
      name: 'Fake City Name'
    }
    const { getByText } = render(<CityCard city={city} listType='list' />)
    expect(getByText(city.name)).toBeInTheDocument()
  })

  test('Check city card will not display name on list mode.', () => {
    const city = {
      name: 'Fake City Name'
    }
    const { queryByText } = render(<CityCard city={city} />)
    expect(queryByText(city.name)).toBeNull()
  })
})

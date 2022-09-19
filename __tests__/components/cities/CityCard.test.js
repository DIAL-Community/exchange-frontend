import { render } from '@testing-library/react'
import CityCard from '../../../components/cities/CityCard'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()
describe('Unit test for the city card.', () => {
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

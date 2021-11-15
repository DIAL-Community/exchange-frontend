import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CityCard from '../../../components/cities/CityCard'

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

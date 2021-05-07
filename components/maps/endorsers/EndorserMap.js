import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

import EndorserInfo from './EndorserInfo'

const EndorserMarkers = (props) => {
  const EndorserMarkers = useMemo(() => dynamic(
    () => import('./EndorserMarkers'),
    {
      loading: () => <div>Loading Map data ...</div>,
      ssr: false
    }
  ), [])
  return <EndorserMarkers {...props} />
}

const EndorserMap = (props) => {
  const [selectedCity, setSelectedCity] = useState('')
  const [organization, setOrganization] = useState()
  const { organizations } = props

  // Group project into map of countries with projects
  const cities = (() => {
    const cities = {}
    const countries = {}
    organizations.forEach(organization => {
      organization.offices.forEach(office => {
        let currentCity = cities[office.name]
        if (!currentCity) {
          currentCity = {
            latitude: office.latitude,
            longitude: office.longitude,
            organizations: []
          }
          cities[office.name] = currentCity
        }

        currentCity.organizations.push({
          name: organization.name,
          slug: organization.slug,
          whenEndorsed: organization.whenEndorsed,
          website: organization.website,
          countries: organization.countries
        })
      })
    })
    return cities
  })()

  const city = cities[selectedCity]

  return (
    <div className='flex flex-row mx-2 my-2'>
      <EndorserMarkers { ...{cities, organization, setSelectedCity, setOrganization}} />
      <EndorserInfo {...{city, setOrganization}} />
    </div>
  )
}

export default EndorserMap

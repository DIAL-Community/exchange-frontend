import { createRef, useEffect, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, LayerGroup, useMap, useMapEvents } from 'react-leaflet'

import { createEndorserMarker } from './EndorserMarker'
import { createProjectMarker } from './ProjectMarker'

import L from 'leaflet'
import { useIntl } from 'react-intl'

const popupTemplate = (title, content) => {
  return `
    <div class='custom-marker-popup'>
      <div class='text-sm font-semibold border-b py-2'>${title}</div>
      <div class='text-sm pt-2'>${content}</div>
    </div>
  `
}

const EndorserMarkers = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const map = useMap()

  const [zooming, setZooming] = useState(false)
  const { cities, organization, setSelectedCity, setOrganization } = props

  const cityMarkerGroup = createRef()
  const countryMarkerGroup = createRef()

  const SELECTED_OPACITY = 1
  const NON_SELECTED_OPACITY = 0.3

  const MARKER_ZOOM = 5
  const DEFAULT_ZOOM = 3

  useEffect(() => {
    if (countryMarkerGroup.current) {
      countryMarkerGroup.current.clearLayers()
    }
    if (organization && organization.countries) {
      organization.countries.forEach(country => {
        const marker = L.marker([country.latitude, country.longitude],
          { icon: createProjectMarker(format('image.alt.logoFor', { name: format('marker.project.title') })) }
        )
        marker.bindPopup(popupTemplate(organization.name, country.name))
        marker.on('click', (e) => e.target.openPopup())
        countryMarkerGroup.current.addLayer(marker)
      })
    }
  }, [organization])

  const markerClickHandler = (e, cityName) => {
    cityMarkerGroup.current.eachLayer(layer => {
      const layerOpacity = layer._leaflet_id === e.target._leaflet_id ? SELECTED_OPACITY : NON_SELECTED_OPACITY
      layer.setOpacity(layerOpacity)
    })
    setSelectedCity(cityName)

    // Set the selected organization and display country where that organization have work
    const selectedOrganization = cities[cityName].organizations.length > 1
      ? cities[cityName].organizations[0]
      : cities[cityName].organizations.shift()
    setOrganization(selectedOrganization)

    // Zoom to the selected marker
    map.flyTo(e.latlng, MARKER_ZOOM)
    setZooming(true)
  }

  useMapEvents({
    click (e) {
      if (zooming) {
        // Return opacity of markers to default value
        cityMarkerGroup.current.eachLayer(layer => {
          layer.setOpacity(SELECTED_OPACITY)
        })
        // De-select city
        setSelectedCity(undefined)
        // De-select organization.
        setOrganization(undefined)

        map.flyTo(e.latlng, DEFAULT_ZOOM)
        setZooming(false)
      }
    }
  })

  return (
    <>
      <LayerGroup ref={countryMarkerGroup} />
      <LayerGroup ref={cityMarkerGroup}>
        {
          Object.keys(cities).map(cityName => {
            const city = cities[cityName]
            return (
              <Marker
                key={cityName}
                icon={createEndorserMarker(format('image.alt.logoFor', { name: format('digitalPrinciple.title') }))}
                position={[city.latitude, city.longitude]}
                riseOnHover
                eventHandlers={{
                  click: (e) => markerClickHandler(e, cityName)
                }}
              />
            )
          })
        }
      </LayerGroup>
    </>
  )
}

const EndorserMarkerMaps = (props) => {
  // Adding this attribute will prevent duplicating world map:  maxBounds={[[-90, -180], [90, 180]]}
  return (
    <MapContainer
      className='w-full' style={{ minHeight: props.height, zIndex: 18 }}
      center={[0, 0]} zoom={3}
      // maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        noWrap
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <EndorserMarkers {...props} />
    </MapContainer>
  )
}

export default EndorserMarkerMaps

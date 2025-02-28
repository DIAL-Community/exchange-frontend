import 'leaflet/dist/leaflet.css'
import { createRef, useState } from 'react'
import { LayerGroup, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { createCountryMarkerIcon } from './CountryMarker'

const CountryMarkers = ({ countriesWithProjects, setSelectedCountryName }) => {
  const map = useMap()
  const [zooming, setZooming] = useState(false)

  const countryMarkerGroup = createRef()

  const SELECTED_OPACITY = 1
  const NON_SELECTED_OPACITY = 0.3

  const MARKER_ZOOM = 5
  const DEFAULT_ZOOM = 3

  const markerClickHandler = (e, countryName) => {
    countryMarkerGroup.current.eachLayer(layer => {
      const layerOpacity = layer._leaflet_id === e.target._leaflet_id
        ? SELECTED_OPACITY
        : NON_SELECTED_OPACITY
      layer.setOpacity(layerOpacity)
    })
    setSelectedCountryName(countryName)

    // Zoom to the selected marker
    map.flyTo(e.latlng, MARKER_ZOOM)
    setZooming(true)
  }

  useMapEvents({
    click (e) {
      if (zooming) {
        // Return opacity of markers to default value
        countryMarkerGroup.current.eachLayer(layer => {
          layer.setOpacity(SELECTED_OPACITY)
        })
        setSelectedCountryName(undefined)

        map.flyTo(e.latlng, DEFAULT_ZOOM)
        setZooming(false)
      }
    }
  })

  return (
    <LayerGroup ref={countryMarkerGroup}>
      {Object.keys(countriesWithProjects).map((countryName) => {
        const country = countriesWithProjects[countryName]
        if (country.projects.length === 0) {
          return <div key={countryName} />
        }

        return (
          <Marker
            key={countryName}
            icon={createCountryMarkerIcon(country)}
            position={[country.latitude, country.longitude]}
            eventHandlers={{
              click: (e) => markerClickHandler(e, countryName)
            }}
          />
        )
      })}
    </LayerGroup>
  )
}

const ProjectLeaflet = ({ initialCountry, containerHeight, ...props }) => {
  const center = initialCountry ? [initialCountry.latitude, initialCountry.longitude] : [0, 0]

  return (
    <MapContainer
      zoom={initialCountry ? 4 : 3}
      center={center}
      className='w-full'
      style={{ minHeight: containerHeight, zIndex: 18 }}
      // Adding this attribute will prevent duplicating world map:
      // maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <CountryMarkers {...props} />
    </MapContainer>
  )
}

export default ProjectLeaflet

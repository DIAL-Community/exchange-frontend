import { MapContainer, Marker, TileLayer, LayerGroup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createRef, useState } from 'react'
import { createCountryMarkerIcon } from './CountryMarker'

const CountryMarkers = ({ countries, setSelectedCountry }) => {
  const map = useMap()
  const [zooming, setZooming] = useState(false)

  const countryMarkerGroup = createRef()

  const SELECTED_OPACITY = 1
  const NON_SELECTED_OPACITY = 0.3

  const MARKER_ZOOM = 5
  const DEFAULT_ZOOM = 3

  const markerClickHandler = (e, countryId) => {
    countryMarkerGroup.current.eachLayer(layer => {
      const layerOpacity = layer._leaflet_id === e.target._leaflet_id
        ? SELECTED_OPACITY
        : NON_SELECTED_OPACITY
      layer.setOpacity(layerOpacity)
    })
    setSelectedCountry(countryId)

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
        setSelectedCountry(undefined)

        map.flyTo(e.latlng, DEFAULT_ZOOM)
        setZooming(false)
      }
    }
  })

  return (
    <LayerGroup ref={countryMarkerGroup}>
      {
        Object.keys(countries).map((countryId) => {
          const country = countries[countryId]
          if (country.aggregators.length === 0) {
            return <div key={countryId} />
          }

          return (
            <Marker
              key={countryId}
              icon={createCountryMarkerIcon(country)}
              position={[country.latitude, country.longitude]}
              eventHandlers={{
                click: (e) => markerClickHandler(e, countryId)
              }}
            />
          )
        })
      }
    </LayerGroup>
  )
}

const CountryMarkersMaps = (props) => {
  // Adding this attribute will prevent duplicating world map:  maxBounds={[[-90, -180], [90, 180]]}
  return (
    <MapContainer
      zoom={3}
      center={[0, 0]}
      className='w-full'
      style={{ minHeight: '70vh', zIndex: 18 }}
      // maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        noWrap
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <CountryMarkers {...props} />
    </MapContainer>
  )
}

export default CountryMarkersMaps

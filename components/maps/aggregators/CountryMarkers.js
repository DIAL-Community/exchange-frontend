import { MapContainer, Marker, TileLayer, LayerGroup, useMap, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createCountryMarkerIcon } from './CountryMarker'
import { createRef, useState } from 'react'

const CountryMarkers = (props) => {
  const [zooming, setZooming] = useState(false)
  const { countries, setSelectedCountry } = props

  const map = useMap()

  const countryMarkerGroup = createRef()

  const SELECTED_OPACITY = 1
  const NON_SELECTED_OPACITY = 0.3

  const MARKER_ZOOM = 5
  const DEFAULT_ZOOM = 3

  const markerClickHandler = (e, countryName) => {
    countryMarkerGroup.current.eachLayer(layer => {
      const layerOpacity = layer._leaflet_id === e.target._leaflet_id ? SELECTED_OPACITY : NON_SELECTED_OPACITY
      layer.setOpacity(layerOpacity)
    })
    setSelectedCountry(countryName)

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
        Object.keys(countries).map(countryName => {
          const country = countries[countryName]
          if (country.aggregators.length === 0) {
            return <></>
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
        })
      }
    </LayerGroup>
  )
}

const CountryMarkersMaps = (props) => {
  // Adding this attribute will prevent duplicating world map:  maxBounds={[[-90, -180], [90, 180]]}
  return (
    <MapContainer center={[0, 0]} zoom={3} className='z-10 w-full' style={{ minHeight: '70vh' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <CountryMarkers {...props} />
    </MapContainer>
  )
}

export default CountryMarkersMaps
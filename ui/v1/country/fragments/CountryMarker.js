import { MapContainer, Marker, TileLayer, LayerGroup } from 'react-leaflet'
import { createRef } from 'react'
import { DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const createCountryMarkerIcon = () => {
  return new DivIcon({
    className: 'custom-div-icon',
    html: '<div style="background-color:#3F9EDD;" class="marker-pin" />',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  })
}

const CountryMarker = ({ country }) => {
  const countryMarkerGroup = createRef()

  return (
    <LayerGroup ref={countryMarkerGroup}>
      <Marker
        key={country.name}
        icon={createCountryMarkerIcon()}
        position={[country.latitude, country.longitude]}
      />
    </LayerGroup>
  )
}

const CountryMarkerMap = ({ country }) => {
  // Adding this attribute will prevent duplicating world map:  maxBounds={[[-90, -180], [90, 180]]}
  return (
    <MapContainer
      style={{ minHeight: '30vh', zIndex: 18 }}
      center={[country.latitude, country.longitude]}
      zoom={5}
      // maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        noWrap
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <CountryMarker country={country} />
    </MapContainer>
  )
}

export default CountryMarkerMap

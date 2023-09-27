import { MapContainer, Marker, TileLayer, LayerGroup } from 'react-leaflet'
import { createRef } from 'react'
import { DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const createCityMarkerIcon = () => {
  return new DivIcon({
    className: 'custom-div-icon',
    html: '<div style="background-color:#3F9EDD;" class="marker-pin" />',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  })
}

const CityMarker = ({ city }) => {
  const cityMarkerGroup = createRef()

  return (
    <LayerGroup ref={cityMarkerGroup}>
      <Marker
        key={city.name}
        icon={createCityMarkerIcon()}
        position={[city.latitude, city.longitude]}
      />
    </LayerGroup>
  )
}

const CityMarkerMap = ({ city }) => {
  // Adding this attribute will prevent duplicating world map:  maxBounds={[[-90, -180], [90, 180]]}
  return (
    <MapContainer
      style={{ minHeight: '30vh', zIndex: 18 }}
      center={[city.latitude, city.longitude]}
      zoom={8}
      // maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        noWrap
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <CityMarker city={city} />
    </MapContainer>
  )
}

export default CityMarkerMap

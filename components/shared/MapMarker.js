import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { divIcon } from 'leaflet'

const createIcon = (imageSrc, altText) => divIcon({
  className: 'custom-div-icon',
  html: `
    <div>
      <div style='background-color:#3F9EDD;' class='marker-pin'></div>
      <img alt='${altText}' src='${imageSrc}'/>
    </div>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
})

const MapMarker = ({ position, title, body, markerImage, markerImageAltText, initialZoom = 10 }) => {
  return (
    <MapContainer center={position} zoom={initialZoom} className='w-full 2xl:w-3/6 h-80 z-10'>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker icon={createIcon(markerImage, markerImageAltText)} position={position}>
        <Popup>
          <div className='text-base font-semibold border-b pb-2'>
            {title}
          </div>
          <div className='text-base pt-2'>
            {body}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapMarker

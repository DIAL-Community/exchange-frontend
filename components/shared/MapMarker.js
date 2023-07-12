import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { divIcon } from 'leaflet'

const createIcon = (imageSrc, altText, isEndorser) => divIcon({
  className: 'custom-div-icon',
  html: `
    <div>
      <div style='${isEndorser ? 'background-color:#3F9EDD' : 'background-color:#607D8B'}' class='marker-pin'></div>
       <img style='${!isEndorser && 'display: none'}' alt='${altText}' src='${imageSrc}'/>
    </div>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
})

const MapMarker = ({ position, title, body, markerImage, markerImageAltText, initialZoom = 10, isEndorser }) => {
  return (
    <MapContainer center={position} zoom={initialZoom} className='h-80 z-10 mt-12'>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker icon={createIcon(markerImage, markerImageAltText, isEndorser)} position={position}>
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

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { icon } from 'leaflet'

const Icon = icon({
  iconUrl: '/icons/digiprins/digiprins.png',
  iconSize: [18, 18]
})

const OfficeMarker = (props) => {
  const { position, title, body } = props
  return (
    <MapContainer center={position} zoom={10} className='w-full 2xl:w-3/6 h-80 z-10'>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker icon={Icon} position={position}>
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

export default OfficeMarker

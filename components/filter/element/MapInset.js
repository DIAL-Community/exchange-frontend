import { MapContainer, Marker, TileLayer } from "react-leaflet"
import EndorserMarker from "../../maps/endorsers/EndorserMarker"
import ProjectMarker from "../../maps/endorsers/ProjectMarker"

const latitudeBoundary = [-88, 88]
const longitudeBoundary = [-88, 88]

const randomLocations = (() => {
  const randomLocations = []
  for (let i = 0; i < 20; i++) {
    randomLocations.push({
      latitude: Math.random() * (latitudeBoundary[1] - latitudeBoundary[0] + 1) + latitudeBoundary[0],
      longitude: Math.random() * (longitudeBoundary[1] - longitudeBoundary[0] + 1) + longitudeBoundary[0]
    })
  }
  return randomLocations
})()


const MapInset = (props) => {
  const { insetFor } = props
  const icon = insetFor === 'endorsers' ? EndorserMarker : insetFor === 'projects' ? ProjectMarker : EndorserMarker

  return (
    <MapContainer center={[0, 0]} zoom={3} className='z-10 w-full' style={{ minHeight: '10vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {
        randomLocations.map((randomLocation, index) => (
          <Marker
            key={index}
            icon={icon}
            position={[randomLocation.latitude, randomLocation.longitude]}
          />
        ))
      }
    </MapContainer>
  )
}

export default MapInset

import 'leaflet/dist/leaflet.css'
import { createRef, useState } from 'react'
import { LayerGroup, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { createLocationMarkerIcon } from './LocationMarker'

const LocationMarkers = ({ countryProjects, setSelectedLocation }) => {
  const map = useMap()
  const [zooming, setZooming] = useState(false)

  const locationMarkerGroup = createRef()

  const SELECTED_OPACITY = 1
  const NON_SELECTED_OPACITY = 0.3

  const MARKER_ZOOM = 5
  const DEFAULT_ZOOM = 5

  const markerClickHandler = (e, location) => {
    locationMarkerGroup.current.eachLayer(layer => {
      const layerOpacity = layer._leaflet_id === e.target._leaflet_id
        ? SELECTED_OPACITY
        : NON_SELECTED_OPACITY
      layer.setOpacity(layerOpacity)
    })
    setSelectedLocation(location)

    // Zoom to the selected marker
    map.flyTo(e.latlng, MARKER_ZOOM)
    setZooming(true)
  }

  useMapEvents({
    click (e) {
      if (zooming) {
        // Return opacity of markers to default value
        locationMarkerGroup.current.eachLayer(layer => {
          layer.setOpacity(SELECTED_OPACITY)
        })
        setSelectedLocation(undefined)

        map.flyTo(e.latlng, DEFAULT_ZOOM)
        setZooming(false)
      }
    }
  })

  return (
    <LayerGroup ref={locationMarkerGroup}>
      {Object.keys(countryProjects).map((locationName) => {
        const location = countryProjects[locationName]
        if (location.projects.length === 0) {
          return <div key={locationName} />
        }

        return (
          <Marker
            key={locationName}
            icon={createLocationMarkerIcon(location)}
            position={[location.projects[0].latitude, location.projects[0].longitude]}
            eventHandlers={{
              click: (e) => markerClickHandler(e, locationName)
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
      zoom={initialCountry ? 5 : 4}
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
      <LocationMarkers {...props} />
    </MapContainer>
  )
}

export default ProjectLeaflet

import { divIcon } from 'leaflet'

const ProjectMarker = divIcon({
  className: 'custom-div-icon',
  html: `
    <div style='background-color:#607D8B;' class='marker-pin'>
    </div>
    <img src='/images/main/project-logo.svg'/>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
})

export default ProjectMarker

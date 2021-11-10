import { DivIcon } from 'leaflet'

export const createProjectMarker = (altText) => new DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style='background-color:#607D8B;' class='marker-pin'>
    </div>
    <img alt='${altText}' src='/images/main/project-logo.svg'/>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
})

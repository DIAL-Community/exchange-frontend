import { DivIcon } from 'leaflet'

export const createEndorserMarker = (altText) => {
  return new DivIcon({
    className: 'custom-div-icon',
    html: `
      <div style='background-color:#3F9EDD;' class='marker-pin'>
      </div>
      <img alt='${altText}' src='/icons/digiprins/digiprins.png'/>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  })
}

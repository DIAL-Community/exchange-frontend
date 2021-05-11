import { divIcon } from 'leaflet'

const EndorserMarker = divIcon({
  className: 'custom-div-icon',
  html: `
    <div style='background-color:#3F9EDD;' class='marker-pin'>
    </div>
    <img src='/icons/digiprins/digiprins.png'/>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
})

export default EndorserMarker

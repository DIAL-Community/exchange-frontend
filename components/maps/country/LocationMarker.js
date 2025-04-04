import { divIcon } from 'leaflet'

const iconSizeSets = {
  20: {
    size: 32,
    fontSize: '12px',
    marginTop: '4px'
  },
  40: {
    size: 48,
    fontSize: '16px',
    marginTop: '8px'
  },
  60: {
    size: 64,
    fontSize: '20px',
    marginTop: '12px'
  },
  80: {
    size: 80,
    fontSize: '28px',
    marginTop: '16px'
  }
}

const findIndex = (projectCount) => {
  const keys = Object.keys(iconSizeSets)
  if (projectCount >= parseInt(keys[keys.length - 1])) {
    return keys[keys.length - 1]
  }

  const filteredIndex = keys.filter(size => parseInt(size) > projectCount)

  return filteredIndex.shift()
}

export const createLocationMarkerIcon = (location) => {
  const { fontSize, marginTop, size } = iconSizeSets[findIndex(location.projects.length)]

  return divIcon({
    className: 'border-2 border-dial-orange rounded-full bg-dial-sunshine',
    html: `
      <div class='text-dial-stratos w-full h-full'>
        <div
          class='text-center'
          style='font-size: ${fontSize}; margin-top: ${marginTop}; font-weight: bolder;'
        >
          ${location.projects.length}
        </div>
      </div>
    `,
    iconSize: [size, size]
  })
}

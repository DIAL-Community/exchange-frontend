import { divIcon } from 'leaflet'

const iconSizeSets = {
  4: {
    size: 32,
    fontSize: '12px',
    marginTop: '4px'
  },
  8: {
    size: 48,
    fontSize: '16px',
    marginTop: '8px'
  },
  12: {
    size: 64,
    fontSize: '20px',
    marginTop: '12px'
  },
  14: {
    size: 80,
    fontSize: '28px',
    marginTop: '16px'
  }
}

const findIndex = (aggregatorCount) => {
  const keys = Object.keys(iconSizeSets)
  if (aggregatorCount >= parseInt(keys[keys.length - 1])) {
    return keys[keys.length - 1]
  }

  const filteredIndex = keys.filter(size => parseInt(size) > aggregatorCount)

  return filteredIndex.shift()
}

export const createCountryMarkerIcon = (country) => {
  const { fontSize, marginTop, size } = iconSizeSets[findIndex(country.aggregators.length)]

  return divIcon({
    className: 'border-2 rounded-full border-dial-meadow bg-dial-mint',
    html: `
      <div class='text-dial-stratos w-full h-full'>
        <div
          class='text-center'
          style='font-size: ${fontSize}; margin-top: ${marginTop}; font-weight: bolder;'
        >
          ${country.aggregators.length}
        </div>
      </div>
    `,
    iconSize: [size, size]
  })
}

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
  const iconSize = iconSizeSets[findIndex(country.aggregators.length)]

  return divIcon({
    className: 'border-3 rounded-full border-workflow-light bg-workflow',
    html: `
      <div class='text-white w-full h-full'>
        <div class='text-center' style='font-size: ${iconSize.fontSize}; margin-top: ${iconSize.marginTop}; font-weight: bolder;'>
          ${country.aggregators.length}
        </div>
      </div>
    `,
    iconSize: [iconSize.size, iconSize.size]
  })
}

const NAVIGATION_ITEMS = {
  'filter.entity.sdgs': 'sdgs',
  'filter.entity.useCases': 'use-cases',
  'filter.entity.workflows': 'workflows',
  'filter.entity.buildingBlocks': 'building-blocks',
  'filter.entity.products': 'products',
  'filter.entity.datasets': 'datasets',
  'filter.entity.projects': 'projects',
  'filter.entity.organizations': 'organizations',
  'filter.entity.playbooks': 'playbooks',
  'filter.entity.maps': 'maps'
}

export const navOptions = (format) => {
  return Object.entries(NAVIGATION_ITEMS).map(([key, value]) => {
    return { label: format(key), value }
  })
}

export const currentActiveNav = (format, currentPath) => {
  return Object.entries(NAVIGATION_ITEMS)
    .map(([key, value]) => {
      return { label: format(key), value }
    })
    .find(item => currentPath.indexOf(item.value) >= 0)
}

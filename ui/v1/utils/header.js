const TOOL_NAVIGATION_ITEMS = {
  'filter.entity.useCases': 'use-cases',
  'filter.entity.buildingBlocks': 'building-blocks',
  'filter.entity.products': 'products'
}

const SUPPORTING_NAVIGATION_ITEMS = {
  'filter.entity.maps': 'maps',
  'filter.entity.datasets': 'datasets',
  'filter.entity.organizations': 'organizations',
  'filter.entity.playbooks': 'playbooks',
  'filter.entity.projects': 'projects',
  'filter.entity.sdgs': 'sdgs',
  'filter.entity.workflows': 'workflows'
}

export const navOptions = (format) => {
  const toolNavItems = Object.entries(TOOL_NAVIGATION_ITEMS).map(([key, value]) => {
    return { label: format(key), value }
  })

  const supportingNavItems = Object.entries(SUPPORTING_NAVIGATION_ITEMS).map(([key, value]) => {
    return { label: format(key), value }
  })

  const navItems = [{
    label: 'Tools',
    options: toolNavItems
  }, {
    label: 'Supporting',
    options: supportingNavItems
  }]

  return navItems
}

export const currentActiveNav = (format, currentPath) => {
  let activeNav = Object.entries(TOOL_NAVIGATION_ITEMS)
    .map(([key, value]) => {
      return { label: format(key), value }
    })
    .find(item => currentPath.indexOf(item.value) >= 0)

  if (!activeNav) {
    activeNav = Object.entries(SUPPORTING_NAVIGATION_ITEMS)
      .map(([key, value]) => {
        return { label: format(key), value }
      })
      .find(item => currentPath.indexOf(item.value) >= 0)
  }

  return activeNav
}

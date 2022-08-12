export const sectorWithoutParentSector = {
  name: 'Example Sector',
  id: 1,
  slug: 'example_sector',
  locale: 'en',
  parentSectorId: null,
  isDisplayable: true
}

export const sectorWithParentSector = {
  name: 'Example Sector',
  id: 1,
  slug: 'example_sector',
  locale: 'en',
  parentSectorId: 226,
  isDisplayable: true
}

export const sectors = {
  data: {
    sectors: [
      {
        name: 'Example Parent Sector',
        id: '226',
        slug: 'example_parent_sector',
        locale: 'en',
        parentSectorId: 22,
        isDisplayable: true
      }
    ]
  }
}

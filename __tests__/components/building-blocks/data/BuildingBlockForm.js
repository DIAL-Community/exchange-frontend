export const buildingBlock = {
  id: 1,
  name: 'Test Building Block',
  slug: 'test_buidling_block',
  maturity: 'BETA',
  specUrl: 'testbuidlingblock.com',
  buildingBlockDescription: {
    description: '<p>test building block description</p>',
    locale: 'en'
  }
}

export const createBuildingBlockSuccess = {
  data: {
    createBuildingBlock: {
      buildingBlock: {
        slug: 'test_building_block'
      },
      errors: []
    }
  }
}

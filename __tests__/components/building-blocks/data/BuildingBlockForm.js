export const buildingBlock = {
  id: 1,
  name: 'Test Building Block',
  slug: 'test_buidling_block',
  imageFile: '',
  maturity: 'DRAFT',
  specUrl: 'testbuidlingblock.com',
  buildingBlockDescription: {
    description: '<p>test building block description</p>',
    locale: 'en'
  },
  products: [
    {
      id: 1,
      name: 'Product 1',
      slug: 'product_1',
      imageFile: '',
      buildingBlocksMappingStatus: ''
    }
  ],
  workflows: [{
    id: 1,
    name: 'Test Workflow',
    slug: 'tw',
    imageFile: ''
  }]
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

export const createBuildingBlockFailure = {
  data: {
    createBuildingBlock: {
      buildingBlock: null,
      errors: ['Some create error message from the backend.']
    }
  }
}

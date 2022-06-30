export const product = {
  id: 1,
  name: 'Test Product',
  slug: 'test_product',
  website: 'testproduct.com',
  imageFile: '/test.jpg',
  aliases: [
    'test1',
    'test2'
  ],
  productDescription: {
    description: '<p>test product description</p>',
    locale: 'en'
  },
  organizations: [{
    id: 1,
    name: 'Test Organization',
    slug: 'to'
  }],
  tags: ['Test Tag'],
  buildingBlocks: [{
    id: 3,
    name: 'Test Building Block',
    slug: 'test_building_block',
    maturity: 'BETA',
    imageFile: 'test-building-block.png'
  }],
  buildingBlocksMappingStatus: 'VALIDATED',
  sectors: [
    {
      id: 1,
      name: 'Test Sector',
      slug: 'test_sector'
    }
  ],
  currentProjects: [
    {
      id: 1,
      name: 'Test Project',
      slug: 'test_project',
      origin: {
        slug: 'origin_slug'
      }
    }
  ],
  sustainableDevelopmentGoals: [{
    id: 1,
    name: 'Test SDG',
    slug: 'test_sdg',
    number: 1
  }],
  sustainableDevelopmentGoalsMappingStatus: 'SELF-REPORTED'
}

export const createProductSuccess = {
  data: {
    createProduct: {
      product: {
        id: 1,
        name: 'Test Product',
        slug: 'test_product',
        website: 'testproduct.com',
        imageFile: '/test.jpg',
        aliases: [
          'test1',
          'test2'
        ],
        productDescription: {
          description: '<p>test product description</p>',
          locale: 'en'
        }
      },
      errors: []
    }
  }
}

export const createProductFailure = {
  data: {
    createProduct: {
      product: {
        id: 1,
        name: 'Test Product',
        slug: 'test_product',
        website: 'testproduct.com',
        imageFile: '/test.jpg',
        aliases: [
          'test1',
          'test2'
        ],
        productDescription: {
          description: '<p>test product description</p>',
          locale: 'en'
        }
      },
      errors: [
        'Must be admin or product owner to create an product'
      ]
    }
  }
}

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
    slug: 'to',
    imageFile: '',
    isEndorser: false,
    whenEndorsed: null,
    sectors: []
  }],
  tags: ['Test Tag'],
  mainRepository: null,
  buildingBlocks: [{
    id: 3,
    name: 'Test Building Block',
    slug: 'test_building_block',
    maturity: 'BETA',
    imageFile: '/test-building-block.png'
  }],
  buildingBlocksMappingStatus: 'VALIDATED',
  sectors: [
    {
      id: 1,
      name: 'Test Sector',
      slug: 'test_sector',
      isDisplayable: true
    }
  ],
  currentProjects: [
    {
      id: 1,
      name: 'Test Project',
      slug: 'test_project',
      origin: {
        slug: 'origin_slug',
        name: 'Origin'
      }
    }
  ],
  sustainableDevelopmentGoals: [{
    id: 1,
    name: 'Test SDG',
    slug: 'test_sdg',
    imageFile: '',
    number: 1
  }],
  sustainableDevelopmentGoalsMappingStatus: 'SELF-REPORTED',
  isLinkedWithDpi: false,
  overallMaturityScore: {},
  maturityScoreDetails: {},
  playbooks: [
    {
      id: 1,
      name: 'Playbook 1',
      slug: 'playbook_1',
      imageFile: '',
      tags: []
    },
    {
      id: 2,
      name: 'Playbook 2',
      slug: 'playbook_2',
      imageFile: '',
      tags: []
    }
  ],
  includes: [],
  interoperatesWith: [],
  endorsers: [],
  origins: [],
  languages: [],
  owner: [],
  commercialProduct: false,
  hostingModel: null,
  pricingModel: null,
  pricingDetails: null,
  manualUpdate: false
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

export const buildingBlockDetail = {
  'data': {
    'buildingBlock': {
      'id': '25',
      'name': 'Analytics and business intelligence',
      'slug': 'analytics-and-business-intelligence',
      'imageFile': '/assets/building-blocks/analytics-and-business-intelligence.svg',
      'maturity': 'DRAFT',
      'category': null,
      'specUrl': null,
      'govStackEntity': false,
      'buildingBlockDescription': {
        'id': '1',
        'description': 'Building block description.',
        'locale': 'en',
        '__typename': 'BuildingBlockDescription'
      },
      'workflows': [
        {
          'id': '21',
          'name': 'Data Analysis and Business Intelligence',
          'slug': 'data-analysis-and-business-intelligence',
          'imageFile': '/assets/workflows/data-analysis-and-business-intelligence.svg',
          '__typename': 'Workflow'
        }
      ],
      'products': [
        {
          'id': '1008',
          'name': 'AgrInfo Jembe',
          'slug': 'agrinfo-jembe',
          'imageFile': '/assets/products/agrinfo-jembe.png',
          'buildingBlocksMappingStatus': 'BETA',
          '__typename': 'Product'
        },
        {
          'id': '796',
          'name': 'Goldkeys',
          'slug': 'goldkeys',
          'imageFile': '/assets/products/goldkeys.png',
          'buildingBlocksMappingStatus': 'BETA',
          '__typename': 'Product'
        }
      ],
      '__typename': 'BuildingBlock'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const createBuildingBlock = {
  'data': {
    'createBuildingBlock': {
      'buildingBlock': {
        'id': '25',
        'name': 'Analytics and business intelligence -- Edited',
        'slug': 'analytics-and-business-intelligence',
        'specUrl': null,
        'maturity': 'DRAFT',
        'category': null,
        'govStackEntity': false,
        'buildingBlockDescription': {
          'id': '1',
          'description': 'Building block description',
          'locale': 'en',
          '__typename': 'BuildingBlockDescription'
        },
        '__typename': 'BuildingBlock'
      },
      'errors': [],
      '__typename': 'CreateBuildingBlockPayload'
    }
  }
}

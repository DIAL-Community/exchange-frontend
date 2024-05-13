export const productDetail = {
  'data': {
    'product': {
      'id': '46',
      'name': '@firma',
      'slug': 'firma',
      'aliases': [],
      'imageFile': '/assets/products/firma.png',
      'website': 'administracionelectronica.gob.es/ctt/clienteafirma',
      'extraAttributes': {},
      'commercialProduct': false,
      'pricingModel': null,
      'pricingDetails': null,
      'hostingModel': null,
      'languages': [
        {
          'node': {
            'name': 'Java',
            'color': '#b07219'
          },
          'size': 9974367
        },
        {
          'node': {
            'name': 'C#',
            'color': '#178600'
          },
          'size': 2929073
        },
        {
          'node': {
            'name': 'HTML',
            'color': '#e34c26'
          },
          'size': 1087367
        },
        {
          'node': {
            'name': 'Other',
            'color': '#fd807f'
          },
          'size': 384138
        }
      ],
      'haveOwner': false,
      'govStackEntity': false,
      'productDescription': {
        'id': '24',
        'description': 'Description for the product.',
        'locale': 'en',
        '__typename': 'ProductDescription'
      },
      'countries': [],
      'origins': [
        {
          'id': '3',
          'name': 'Digital Public Goods Alliance',
          'slug': 'dpga',
          '__typename': 'Origin'
        }
      ],
      'endorsers': [],
      'interoperatesWith': [],
      'includes': [],
      'organizations': [
        {
          'id': '377',
          'name': 'Technology Transfer Center, Government of Spain',
          'slug': 'technology-transfer-center-government-of-spain',
          'imageFile': '/assets/organizations/organization-placeholder.png',
          '__typename': 'Organization'
        }
      ],
      'resources': [],
      'currentProjects': [
        {
          'id': '3304',
          'name': 'Firma',
          'slug': 'firma',
          'origin': {
            'id': '8',
            'name': 'Digital Government Platform Tracker',
            'slug': 'digital-government-platform-tracker',
            '__typename': 'Origin'
          },
          '__typename': 'Project'
        }
      ],
      'buildingBlocks': [],
      'buildingBlocksMappingStatus': null,
      'sdgs': [],
      'sdgsMappingStatus': 'SELF-REPORTED',
      'sectors': [
        {
          'id': '211',
          'name': 'State and Democracy (Good Governance)',
          'slug': 'state-and-democracy-good-governance-duplicate-0',
          '__typename': 'Sector'
        }
      ],
      'manualUpdate': true,
      'mainRepository': {
        'id': '166',
        'name': '@firma Repository Information',
        'slug': 'firma-repository',
        'license': 'None',
        'absoluteUrl': 'github.com/ctt-gob-es/clienteafirma',
        '__typename': 'ProductRepository'
      },
      'overallMaturityScore': 65.17,
      'maturityScoreDetails': [],
      'isLinkedWithDpi': false,
      'tags': [],
      '__typename': 'Product'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const ownedProducts = {
  'data': {
    'ownedProducts': []
  }
}

export const createProduct = {
  'data': {
    'createProduct': {
      'product': {
        'id': '46',
        'name': '@firma -- Edited',
        'slug': 'firma',
        'aliases': [
          ''
        ],
        'website': 'administracionelectronica.gob.es/ctt/clienteafirma',
        'imageFile': '/assets/products/firma.png',
        'govStackEntity': false,
        'productDescription': {
          'id': '24',
          'description': 'Description for the product.',
          'locale': 'en',
          '__typename': 'ProductDescription'
        },
        '__typename': 'Product'
      },
      'errors': [],
      '__typename': 'CreateProductPayload'
    }
  }
}

export const productDetail = {
  'data': {
    'product': {
      'id': '46',
      'name': '@firma',
      'slug': 'firma',
      'aliases': [],
      'imageFile': '/assets/products/firma.png',
      'website': 'administracionelectronica.gob.es/ctt/clienteafirma',
      'extraAttributes': [],
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
      'productStage': null,
      'contact': null,
      'featured': false,
      'productDescription': {
        'id': '24',
        'description': `
          Suite of solutions for digital identities and electronic signatures, aimed at public
          administrations for the implementation of authentication and electronic signatures in
          a streamlined and effective manner.
        `,
        'locale': 'en',
        '__typename': 'ProductDescription'
      },
      'countries': [],
      'origins': [
        {
          'id': '6',
          'name': 'Manually Entered',
          'slug': 'manually-entered',
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
          'id': '3306',
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
      'sdgs': [
        {
          'id': '23',
          'name': 'Good Health and Well-Being',
          'slug': 'good-health-and-wellbeing',
          'imageFile': '/assets/sdgs/good-health-and-wellbeing.png',
          'number': 3,
          'sdgTargets': [
            {
              'id': '16',
              '__typename': 'SustainableDevelopmentGoalTarget'
            },
            {
              'id': '17',
              '__typename': 'SustainableDevelopmentGoalTarget'
            }
          ],
          '__typename': 'SustainableDevelopmentGoal'
        },
        {
          'id': '27',
          'name': 'Peace, Justice and Strong Institutions',
          'slug': 'peace-justice-and-strong-institutions',
          'imageFile': '/assets/sdgs/peace-justice-and-strong-institutions.png',
          'number': 16,
          'sdgTargets': [
            {
              'id': '139',
              '__typename': 'SustainableDevelopmentGoalTarget'
            },
            {
              'id': '140',
              '__typename': 'SustainableDevelopmentGoalTarget'
            },
            {
              'id': '141',
              '__typename': 'SustainableDevelopmentGoalTarget'
            }
          ],
          '__typename': 'SustainableDevelopmentGoal'
        }
      ],
      'sdgsMappingStatus': 'SELF-REPORTED',
      'sectors': [
        {
          'id': '211',
          'name': 'State and Democracy (Good Governance)',
          'slug': 'state-and-democracy-good-governance-duplicate-0',
          '__typename': 'Sector'
        }
      ],
      'manualUpdate': false,
      'mainRepository': {
        'id': '198',
        'name': '@firma Repository',
        'slug': 'firma-repository',
        'license': 'None',
        'absoluteUrl': 'github.com/ctt-gob-es/clienteafirma',
        '__typename': 'ProductRepository'
      },
      'overallMaturityScore': 65.17,
      'maturityScoreDetails': [],
      'isLinkedWithDpi': false,
      'tags': [],
      'projects': [
        {
          'id': '3306',
          'name': 'Firma',
          'slug': 'firma',
          'countries': [
            {
              'id': '51',
              'name': 'Spain',
              'slug': 'es',
              'code': 'ES',
              '__typename': 'Country'
            }
          ],
          '__typename': 'Project'
        }
      ],
      'softwareCategories': [],
      'softwareFeatures': [],
      'approvalStatus': null,
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

export const siteSettings = {
  'data': {
    'defaultSiteSetting': {
      'id': '1',
      'slug': 'default-site-settings',
      'exchangeLogoUrl': 'exchange.dial.global/ui/v1/exchange-logo.svg',
      'heroCardSection': {},
      'menuConfigurations': [],
      'sectionConfigurations': {},
      'carouselConfigurations': [],
      'siteColors': {},
      'enableMarketplace': false,
      'defaultSetting': true,
      '__typename': 'SiteSetting'
    }
  }
}

export const createProduct = {
  'data': {
    'createProduct': {
      'product': {
        'id': '46',
        'name': '@firma - Edited',
        'slug': 'firma',
        'aliases': [
          ''
        ],
        'website': 'administracionelectronica.gob.es/ctt/clienteafirma',
        'imageFile': '/assets/products/firma.png',
        'govStackEntity': false,
        'productStage': null,
        'extraAttributes': [],
        'featured': false,
        'contact': null,
        'productDescription': {
          'id': '24',
          'description': `
            Suite of solutions for digital identities and electronic signatures, aimed at public
            administrations for the implementation of authentication and electronic signatures in
            a streamlined and effective manner.
          `,
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

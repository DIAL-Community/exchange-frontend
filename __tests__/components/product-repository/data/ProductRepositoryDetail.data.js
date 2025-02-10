export const productRepositoryDetail = {
  'data': {
    'productRepository': {
      'id': '166',
      'name': '@firma Repository',
      'slug': 'firma-repository',
      'description': 'Repository of @firma.',
      'absoluteUrl': 'github.com/ctt-gob-es/clienteafirma',
      'mainRepository': 'true',
      'license': 'None',
      'languageData': {
        'errors': [
          {
            'type': 'RATE_LIMITED',
            'message': 'API rate limit exceeded for user ID 60007722.'
          }
        ]
      },
      'statisticalData': {
        'data': {
          'repository': {
            'isFork': false,
            'pushedAt': '2024-03-22T13:55:30Z',
            'releases': {
              'edges': [],
              'totalCount': 0
            },
            'watchers': {
              'totalCount': 40
            },
            'createdAt': '2014-05-26T12:55:47Z',
            'forkCount': 112,
            'updatedAt': '2024-03-21T08:51:29Z',
            'openIssues': {
              'totalCount': 238
            },
            'stargazers': {
              'totalCount': 243
            },
            'closedIssues': {
              'totalCount': 78
            },
            'commitsOnMainBranch': null,
            'openPullRequestCount': {
              'totalCount': 11
            },
            'commitsOnMasterBranch': {
              'history': {
                'totalCount': 6855
              }
            },
            'closedPullRequestCount': {
              'totalCount': 22
            },
            'mergedPullRequestCount': {
              'totalCount': 32
            }
          }
        },
        'collaborators': 0
      },
      '__typename': 'ProductRepository'
    },
    'product': {
      'id': '46',
      'name': '@firma',
      'slug': 'firma',
      'website': 'administracionelectronica.gob.es/ctt/clienteafirma',
      'imageFile': '/assets/products/firma.png',
      'mainRepository': {
        'id': '166',
        'name': '@firma Repository',
        'slug': 'firma-repository',
        'license': 'None',
        '__typename': 'ProductRepository'
      },
      'sectors': [
        {
          'id': '211',
          'name': 'State and Democracy (Good Governance)',
          'slug': 'state-and-democracy-good-governance-duplicate-0',
          '__typename': 'Sector'
        }
      ],
      '__typename': 'Product'
    }
  }
}

export const ownedProducts = {
  'data': {
    'ownedProducts': []
  }
}

export const productRepositories = {
  'data': {
    'productRepositories': [
      {
        'id': '166',
        'name': '@firma Repository',
        'slug': 'firma-repository',
        '__typename': 'ProductRepository'
      }
    ]
  }
}

export const createProductRepository = {
  'data': {
    'createProductRepository': {
      'productRepository': {
        'id': '166',
        'name': '@firma Repository Information',
        'slug': 'firma-repository',
        'absoluteUrl': 'github.com/ctt-gob-es/clienteafirma',
        'description': 'Repository of @firma.',
        '__typename': 'ProductRepository'
      },
      'errors': [],
      '__typename': 'CreateProductRepositoryPayload'
    }
  }
}

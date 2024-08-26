export const countriesWithResources = {
  data: {
    countries: [
      {
        id: '10',
        name: 'Ethiopia',
        slug: 'et',
        code: 'ET',
        description: 'Some description',
        __typename: 'Country'
      },
      {
        id: '2',
        name: 'Kenya',
        slug: 'ke',
        code: 'KE',
        description: 'Some description',
        __typename: 'Country'
      },
      {
        id: '3',
        name: 'Uganda',
        slug: 'ug',
        code: 'UG',
        description: 'Some description',
        __typename: 'Country'
      },
      {
        id: '15',
        name: 'Zambia',
        slug: 'zm',
        code: 'ZM',
        description: 'Some description',
        __typename: 'Country'
      }
    ]
  }
}

export const countryResources = {
  data: {
    country: {
      id: '15',
      name: 'Zambia',
      slug: 'zm',
      code: 'ZM',
      codeLonger: 'ZMB',
      latitude: '-13.133897',
      longitude: '27.849332',
      description: 'Some description',
      resources: [
        {
          id: '113',
          name: 'National Digital Transformation Strategy Zambia',
          slug: 'national-digital-transformation-strategy-zambia',
          imageFile: '/assets/resources/resource-placeholder.svg',
          parsedDescription: 'Some description of the resource.',
          __typename: 'Resource'
        },
        {
          id: '114',
          name: 'Zambia\'s E- Government Interoperability Standard',
          slug: 'zambias-egovernment-interoperability-standard',
          imageFile: '/assets/resources/resource-placeholder.svg',
          parsedDescription: 'Some more of the description of the resource.',
          __typename: 'Resource'
        },
        {
          id: '115',
          name: 'Zambia\'s Smart Government Master Plan',
          slug: 'zambias-smart-government-master-plan',
          imageFile: '/assets/resources/resource-placeholder.svg',
          parsedDescription: 'Some description of the resource.',
          __typename: 'Resource'
        }
      ],
      'products': [
        {
          'id': '29',
          'name': 'RapidPro',
          'slug': 'rapidpro',
          'imageFile': '/assets/products/rapidpro.png',
          '__typename': 'Product'
        },
        {
          'id': '36',
          'name': 'KoboToolbox',
          'slug': 'kobotoolbox',
          'imageFile': '/assets/products/kobotoolbox.png',
          '__typename': 'Product'
        }
      ],
      'dpiProducts': [
        {
          'id': '29',
          'name': 'RapidPro',
          'slug': 'rapidpro',
          'imageFile': '/assets/products/rapidpro.png',
          '__typename': 'Product'
        },
        {
          'id': '36',
          'name': 'KoboToolbox',
          'slug': 'kobotoolbox',
          'imageFile': '/assets/products/kobotoolbox.png',
          '__typename': 'Product'
        }
      ],
      __typename: 'Country'
    }
  }
}

export const policyResources = {
  'data': {
    'paginatedResources': [
      {
        'id': '128',
        'name': 'Sierra Leone National Data Strategy (2023)',
        'slug': 'sierra-leone-national-data-strategy-2023',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': 'Some description',
        'parsedDescription': 'Some parsed description',
        'resourceLink': 'moic.gov.sl/strategies',
        'linkDescription': null,
        'resourceType': 'Government Document',
        'resourceTopics': [
          {
            'id': '25',
            'name': 'Enabling Environment',
            'slug': 'enabling-environment',
            '__typename': 'ResourceTopic'
          }
        ],
        'publishedDate': null,
        'products': [],
        'authors': [
          {
            'id': '81',
            'name': 'Ministry of Information and Communication',
            'slug': 'ministry-of-information-and-communication',
            '__typename': 'Author'
          }
        ],
        'tags': [
          'Enabling Environment'
        ],
        '__typename': 'Resource'
      },
      {
        'id': '129',
        'name': 'Sierra Leone National Cyber Security Strategy (2021-2025)',
        'slug': 'sierra-leone-national-cyber-security-strategy-2021-2025',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': 'Some description',
        'parsedDescription': 'Some parsed description',
        'resourceLink': 'moic.gov.sl/strategies',
        'linkDescription': null,
        'resourceType': 'Government Document',
        'resourceTopics': [
          {
            'id': '25',
            'name': 'Enabling Environment',
            'slug': 'enabling-environment',
            '__typename': 'ResourceTopic'
          }
        ],
        'publishedDate': null,
        'products': [],
        'authors': [
          {
            'id': '81',
            'name': 'Ministry of Information and Communication',
            'slug': 'ministry-of-information-and-communication',
            '__typename': 'Author'
          }
        ],
        'tags': [
          'Enabling Environment'
        ],
        '__typename': 'Resource'
      },
      {
        'id': '130',
        'name': 'Sierra Leone National Cyber Security Policy (2021)',
        'slug': 'sierra-leone-national-cyber-security-policy-2021',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': 'Some description',
        'parsedDescription': 'Some parsed description',
        'resourceLink': 'moic.gov.sl/policies_',
        'linkDescription': null,
        'resourceType': 'Government Document',
        'resourceTopics': [
          {
            'id': '25',
            'name': 'Enabling Environment',
            'slug': 'enabling-environment',
            '__typename': 'ResourceTopic'
          }
        ],
        'publishedDate': null,
        'products': [],
        'authors': [],
        'tags': [
          'Enabling Environment'
        ],
        '__typename': 'Resource'
      },
      {
        'id': '134',
        'name': 'Sierra Leone National Innovation \u0026 Digital Strategy',
        'slug': 'sierra-leone-national-innovation--digital-strategy',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': 'Some description',
        'parsedDescription': 'Some parsed description',
        'resourceLink': 'www.dsti.gov.sl',
        'linkDescription': null,
        'resourceType': 'Government Document',
        'resourceTopics': [
          {
            'id': '25',
            'name': 'Enabling Environment',
            'slug': 'enabling-environment',
            '__typename': 'ResourceTopic'
          }
        ],
        'publishedDate': null,
        'products': [],
        'authors': [
          {
            'id': '82',
            'name': 'Directorate of Science Technology \u0026 Innovation',
            'slug': 'directorate-of-science-technology--innovation',
            '__typename': 'Author'
          }
        ],
        'tags': [
          'Enabling Environment'
        ],
        '__typename': 'Resource'
      }
    ]
  }
}

export const policyResourcePagination = {
  'data': {
    'paginationAttributeResource': {
      'totalCount': 4,
      '__typename': 'PaginationAttributes'
    }
  }
}

export const websiteResources = {
  'data': {
    'paginatedResources': [
      {
        'id': '131',
        'name': 'Stats SL Open Data Dashboard',
        'slug': 'stats-sl-open-data-dashboard',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': '',
        'parsedDescription': '',
        'resourceLink': 'www.statistics.sl/index.php/what-we-offer/open-data-free-datasets.html',
        'linkDescription': null,
        'resourceType': 'National Website',
        'resourceTopics': [],
        'publishedDate': null,
        'products': [],
        'authors': [],
        'tags': [],
        '__typename': 'Resource'
      },
      {
        'id': '132',
        'name': 'Sierra Leone Data Portal',
        'slug': 'sierra-leone-data-portal',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': '',
        'parsedDescription': '',
        'resourceLink': 'sierraleone.opendataforafrica.org/data/#menu=topic',
        'linkDescription': null,
        'resourceType': 'National Website',
        'resourceTopics': [],
        'publishedDate': null,
        'products': [],
        'authors': [],
        'tags': [],
        '__typename': 'Resource'
      },
      {
        'id': '133',
        'name': 'Sirerra Leone Citizen\'s Portal',
        'slug': 'sirerra-leone-citizens-portal',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': '',
        'parsedDescription': '',
        'resourceLink': 'portal.moppa.gov.sl',
        'linkDescription': null,
        'resourceType': 'National Website',
        'resourceTopics': [],
        'publishedDate': null,
        'products': [],
        'authors': [],
        'tags': [],
        '__typename': 'Resource'
      }
    ]
  }
}

export const websiteResourcePagination = {
  'data': {
    'paginationAttributeResource': {
      'totalCount': 3,
      '__typename': 'PaginationAttributes'
    }
  }
}

export const resources = {
  'data': {
    'paginatedResources': [
      {
        'id': '131',
        'name': 'Stats SL Open Data Dashboard',
        'slug': 'stats-sl-open-data-dashboard',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': '',
        'parsedDescription': '',
        'resourceLink': 'www.statistics.sl/index.php/what-we-offer/open-data-free-datasets.html',
        'linkDescription': null,
        'resourceType': 'National Website',
        'resourceTopics': [],
        'publishedDate': null,
        'products': [],
        'authors': [],
        'tags': [],
        '__typename': 'Resource'
      },
      {
        'id': '132',
        'name': 'Sierra Leone Data Portal',
        'slug': 'sierra-leone-data-portal',
        'imageFile': '/assets/resources/resource-placeholder.svg',
        'description': '',
        'parsedDescription': '',
        'resourceLink': 'sierraleone.opendataforafrica.org/data/#menu=topic',
        'linkDescription': null,
        'resourceType': 'National Website',
        'resourceTopics': [],
        'publishedDate': null,
        'products': [],
        'authors': [],
        'tags': [],
        '__typename': 'Resource'
      }
    ]
  }
}

export const resourcePagination = {
  'data': {
    'paginationAttributeResource': {
      'totalCount': 2,
      '__typename': 'PaginationAttributes'
    }
  }
}

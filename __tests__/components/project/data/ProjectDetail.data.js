export const projectDetail = {
  'data': {
    'project': {
      'id': '365',
      'name': 'Colombia HMIS',
      'slug': 'colombia-hmis',
      'tags': [],
      'projectWebsite': 'digitalhealthatlas.org/en/-/projects/1047/published',
      'projectDescription': {
        'id': '365',
        'description': 'eMoH implementation of DHIS2.',
        'locale': 'en',
        '__typename': 'ProjectDescription'
      },
      'organizations': [
        {
          'id': '85',
          'slug': 'john-snow-inc-jsi',
          'name': 'John Snow, Inc. (JSI)',
          'imageFile': '/assets/organizations/john-snow-inc-jsi.png',
          '__typename': 'Organization'
        },
        {
          'id': '233',
          'slug': 'dhis2',
          'name': 'DHIS2',
          'imageFile': '/assets/organizations/dhis2.png',
          '__typename': 'Organization'
        }
      ],
      'products': [
        {
          'id': '3',
          'slug': 'dhis2',
          'name': 'DHIS2',
          'imageFile': '/assets/products/dhis2.png',
          '__typename': 'Product'
        }
      ],
      'sectors': [
        {
          'id': '39',
          'name': 'Health',
          'slug': 'health',
          '__typename': 'Sector'
        },
        {
          'id': '246',
          'name': 'Digital, Data, and Technology',
          'slug': 'digital-data-and-technology-duplicate-0',
          '__typename': 'Sector'
        }
      ],
      'sdgs': [],
      'countries': [
        {
          'id': '40',
          'name': 'Colombia',
          'slug': 'co',
          'code': 'CO',
          '__typename': 'Country'
        }
      ],
      'origin': {
        'id': '4',
        'slug': 'digital-health-atlas',
        'name': 'Digital Health Atlas',
        '__typename': 'Origin'
      },
      '__typename': 'Project'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const ownedProjects = {
  'data': {
    'ownedProjects': []
  }
}

export const createProject = {
  'data': {
    'createProject': {
      'project': {
        'id': '365',
        'name': 'Colombia HMIS - Edited Again',
        'slug': 'colombia-hmis',
        'countries': [
          {
            'id': '40',
            'name': 'Colombia',
            'slug': 'co',
            'code': 'CO',
            '__typename': 'Country'
          }
        ],
        '__typename': 'Project'
      },
      'errors': [],
      '__typename': 'CreateProjectPayload'
    }
  }
}

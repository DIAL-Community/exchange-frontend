export const organizationDetail = {
  'data': {
    'organization': {
      'id': '190',
      'name': 'AI4GOV',
      'slug': 'ai4gov',
      'isMni': false,
      'website': 'www.ai4gov.net',
      'aliases': [],
      'imageFile': '/assets/organizations/ai4gov.png',
      'isEndorser': true,
      'whenEndorsed': '',
      'endorserLevel': 'none',
      'hasStorefront': false,
      'haveOwner': false,
      'organizationDescription': {
        'id': '934',
        'description': 'Description for the organization.',
        'locale': 'en',
        '__typename': 'OrganizationDescription'
      },
      'offices': [
        {
          'id': '201',
          'name': 'Makati, Metro Manila, PH',
          'slug': 'makati-metro-manila-ph',
          'province': {
            'id': '71',
            'name': 'Metro Manila',
            '__typename': 'Province'
          },
          'country': {
            'id': '17',
            'name': 'Philippines',
            'code': 'PH',
            'codeLonger': 'PHL',
            '__typename': 'Country'
          },
          'cityData': {
            'id': '94',
            'name': 'Makati',
            'slug': 'makati',
            '__typename': 'City'
          },
          'latitude': '14.554729',
          'longitude': '121.0244452',
          '__typename': 'Office'
        }
      ],
      'sectors': [
        {
          'id': '246',
          'name': 'Digital, Data, and Technology',
          'slug': 'digital-data-and-technology-duplicate-0',
          '__typename': 'Sector'
        },
        {
          'id': '198',
          'name': 'Education and Social Development',
          'slug': 'education-and-social-development-duplicate-0',
          '__typename': 'Sector'
        }
      ],
      'countries': [
        {
          'id': '17',
          'name': 'Philippines',
          'slug': 'ph',
          'code': 'PH',
          '__typename': 'Country'
        }
      ],
      'products': [],
      'projects': [],
      'contacts': [],
      '__typename': 'Organization'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const createOrganization = {
  'data': {
    'createOrganization': {
      'organization': {
        'id': '190',
        'name': 'AI4GOV - Edited',
        'slug': 'ai4gov',
        'aliases': [
          ''
        ],
        'website': 'www.ai4gov.net',
        'isEndorser': true,
        'whenEndorsed': '',
        'endorserLevel': 'none',
        'isMni': false,
        'imageFile': '/assets/organizations/ai4gov.png',
        'specialties': [],
        'hasStorefront': false,
        'heroFile': null,
        'organizationDescription': {
          'id': '934',
          'description': 'Description for the organization.',
          'locale': 'en',
          '__typename': 'OrganizationDescription'
        },
        '__typename': 'Organization'
      },
      'errors': [],
      '__typename': 'CreateOrganizationPayload'
    }
  }
}

export const storefrontDetail = {
  'data': {
    'organization': {
      'id': '1321',
      'name': 'Current Storefront',
      'slug': 'current-storefront',
      'website': 'google.com',
      'imageFile': '/assets/organizations/organization-placeholder.png',
      'specialties': [],
      'hasStorefront': true,
      'heroFile': null,
      'organizationDescription': {
        'id': '273759',
        'description': '\u003cp\u003eTest storefront. Updating. Test.\u003c/p\u003e',
        'locale': 'en',
        '__typename': 'OrganizationDescription'
      },
      'offices': [],
      'buildingBlockCertifications': [],
      'productCertifications': [],
      'sectors': [],
      'countries': [
        {
          'id': '60',
          'name': 'Algeria',
          'slug': 'dz',
          'code': 'DZ',
          '__typename': 'Country'
        }
      ],
      'projects': [],
      'contacts': [],
      'resources': [],
      '__typename': 'Organization'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const createStorefront = {
  'data': {
    'createOrganization': {
      'organization': {
        'id': '1321',
        'name': 'Current Storefront',
        'slug': 'current-storefront',
        'aliases': [
          ''
        ],
        'website': 'google.com',
        'isEndorser': false,
        'whenEndorsed': null,
        'endorserLevel': 'none',
        'isMni': false,
        'imageFile': '/assets/organizations/organization-placeholder.png',
        'specialties': [],
        'hasStorefront': true,
        'heroFile': null,
        'organizationDescription': {
          'id': '273759',
          'description': '\u003cp\u003eTest storefront. Updating. Test.\u003c/p\u003e',
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

module.exports = {
  'countries': {
    'data': {
      'countries': [
        {
          'id': 2,
          'name': 'Another Country',
          'slug': 'ac',
          '__typename': 'Country'
        },
      ]
    }
  },
  'organization': {
    'countries': [
      { 'id': 1, 'name': 'Test Country', 'slug': 'ts', '__typename': 'Country' }
    ],
    'id': 1,
    'endorserLevel': 'none',
    'imageFile': '/assets/organizations/test_organization.png',
    'isMni': false,
    'name': 'Test Organization',
    'organizationDescription': {
      'description': 'test description',
      'locale': 'en',
      '__typename': 'OrganizationDescription'
    },
    'slug': 'test_organization',
    'website': 'testorganization.com',
    'whenEndorsed': '2000-01-01',
    '__typename': 'Organization'
  }
}

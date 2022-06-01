module.exports = {
  'organization': {
    'countries': [
      {
        'id': 1,
        'name': 'Test Country',
        'slug': 'ts',
        '__typename': 'Country'
      }
    ],
    'sectors': [
      {
        'id': 1,
        'name': 'Test Sector',
        'slug': 'test_sector',
        '__typename': 'Sector'
      }
    ],
    'projects': [
      {
        'id': 1,
        'name': 'Test Project',
        'slug': 'test_project',
        'origin': {
          'slug': 'origin_slug'
        },
        '__typename': 'Project'
      }
    ],
    'contacts': [],
    'products': [
      { 'id': 1, 'name': 'Test Product', 'slug': 'ts', '__typename': 'Product' }
    ],
    'products': [
      { 'id': 1, 'name': 'Test Product', 'slug': 'ts', '__typename': 'Product' }
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
    'aliases': ['abc', '123'],
    '__typename': 'Organization'
  }
}

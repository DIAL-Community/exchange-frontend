export const organization = {
  countries: [
    {
      id: 1,
      name: 'Test Country',
      slug: 'ts'
    }
  ],
  sectors: [
    {
      id: 1,
      name: 'Test Sector',
      slug: 'test_sector'
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Test Project',
      slug: 'test_project',
      origin: {
        slug: 'origin_slug'
      }
    }
  ],
  contacts: [],
  products: [
    {
      id: 1,
      name: 'Test Product',
      slug: 'ts'
    }
  ],
  id: 1,
  endorserLevel: 'none',
  imageFile: '/assets/organizations/test_organization.png',
  isMni: false,
  name: 'Test Organization',
  organizationDescription: {
    description: 'test description',
    locale: 'en'
  },
  slug: 'test_organization',
  website: 'testorganization.com',
  whenEndorsed: '2000-01-01',
  aliases: ['abc', '123'],
  offices: [
    {
      id: 1,
      name: 'Test Office Location',
      city: 'City',
      region: 'Region',
      country: {
        codeLonger: 'AAA'
      },
      latitude: 1.0,
      longitude: 2.0
    }
  ]
}

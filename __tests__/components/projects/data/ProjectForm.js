const userOwnedOrganization = { name: 'owned organization' }

const userOwnedProducts = [{ id: 1, name: 'Product 1', slug: 'products_1' }]

export const organizationOwnerUserProps = {
  own: {
    organization: userOwnedOrganization
  }
}

export const productOwnerUserProps = {
  own: {
    products: userOwnedProducts
  }
}

export const organizationAndProductOwnerUserProps = {
  own: {
    organization: userOwnedOrganization,
    products: userOwnedProducts
  }
}

export const organizations = {
  data: {
    organizations: [
      {
        id: 1,
        name: 'Organization 1',
        slug: 'organization_1'
      },
      {
        id: 2,
        name: 'Organization 2',
        slug: 'organization_2'
      },
    ]
  }
}

export const products = {
  data: {
    products: [
      {
        id: 1,
        name: 'Product 1',
        slug: 'product_1'
      },
      {
        id: 2,
        name: 'Product 2',
        slug: 'product_2'
      },
      {
        id: 3,
        name: 'Product 3',
        slug: 'product_3'
      },
    ]
  }
}

export const ownedProducts = {
  data: {
    ownedProducts: [
      {
        id: 1,
        name: 'Product 1',
        slug: 'product_1'
      },
      {
        id: 2,
        name: 'Product 2',
        slug: 'product_2'
      }
    ]
  }
}

export const project = {
  id: 1,
  name: 'Test Project',
  slug: 'test_project',
  startDate: '2000-01-01',
  endDate: '2001-01-01',
  projectUrl: 'testproject.com',
  projectDescription: {
    description: '<p>test project description</p>',
    locale: 'en'
  },
  countries: [
    {
      id: 1,
      name: 'Test Country',
      slug: 'ts'
    }
  ]
}

export const createProjectSuccess = {
  data: {
    createProject: {
      project: {
        slug: 'test_product'
      },
      errors: []
    }
  }
}

export const projectOrganization = {
  organizations: [{
    id: '1',
    name: 'Test Organization',
    slug: 'to',
  },
  {
    id: '2',
    name: 'owned organization',
    slug: 'oo',
  }],
}

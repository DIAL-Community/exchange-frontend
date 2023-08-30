export const user = {
  username: 'User Test',
  email: 'user_test@web.com',
  id: 1,
  roles: ['user'],
  products: [
    {
      name: 'product 1',
      slug: 'product_1'
    },
    {
      name: 'product 2',
      slug: 'product_2'
    }
  ],
  organization: {
    name: 'Organization 1',
    slug: 'organization_1'
  },
  allRoles: [
    'admin',
    'ict4sdg',
    'principle',
    'user',
    'org_user',
    'org_product_user',
    'product_user',
    'mni',
    'content_writer',
    'content_editor'
  ]
}

export const userRoles = {
  data: {
    userRoles: [
      'admin',
      'ict4sdg',
      'principle',
      'user',
      'org_user',
      'org_product_user',
      'product_user',
      'mni',
      'content_writer',
      'content_editor'
    ]
  }
}

export const organizations = {
  data: {
    organizations: [
      {
        id: 2,
        name: 'Organization 1',
        imageFile: 'fake-image.png',
        slug: 'Organization 1',
        __typename: 'Organization',
        website: 'test@gmail.com'
      }
    ]
  }
}

export const products = {
  data: {
    products: [
      {
        id: 2,
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

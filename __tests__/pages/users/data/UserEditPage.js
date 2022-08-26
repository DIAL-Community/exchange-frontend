export const user = {
  data: {
    user: {
      username: 'User Test',
      email: 'user_test@web.com',
      id: 1,
      roles: ['user'],
      confirmed: true,
      products: [
        {
          id: 1,
          name: 'product 1',
          slug: 'product_1',
          imageFile: '/example.jpg'
        },
        {
          id: 1,
          name: 'product 2',
          slug: 'product_2',
          imageFile: '/example.jpg'
        }
      ],
      organization: {
        id: 1,
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
  }
}

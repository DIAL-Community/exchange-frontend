module.exports = {
  product: {
    id: 1,
    name: 'Test Product',
    slug: 'test_product',
    website: 'testproduct.com',
    imageFile: '/test.jpg',
    aliases: [
      'test1',
      'test2'
    ],
    productDescription: {
      description: '<p>test product description</p>',
      locale: 'en',
      __typename: 'ProductDescription'
    },
    __typename: 'Product'
  },
  createProductSuccess: {
    data: {
      createProduct: {
        product: {
          id: 1,
          name: 'Test Product',
          slug: 'test_product',
          website: 'testproduct.com',
          imageFile: '/test.jpg',
          aliases: [
            'test1',
            'test2'
          ],
          productDescription: {
            description: '<p>test product description</p>',
            locale: 'en',
            __typename: 'ProductDescription'
          },
          __typename: 'Product'
        },
        errors: []
      }
    }
  },
  createProductFailure: {
    data: {
      createProduct: {
        product: {
          id: 1,
          name: 'Test Product',
          slug: 'test_product',
          website: 'testproduct.com',
          imageFile: '/test.jpg',
          aliases: [
            'test1',
            'test2'
          ],
          productDescription: {
            description: '<p>test product description</p>',
            locale: 'en',
            __typename: 'ProductDescription'
          },
          __typename: 'Product'
        },
        errors: [
          'Must be admin or product owner to create an product'
        ]
      }
    }
  }
}

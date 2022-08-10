export const user = {
  username: 'Some User',
  email: 'some_user@some-website.com',
  roles: ['org_user'],
  products: [],
  organization: {
    name: 'Some Organization',
    slug: 'some_organization'
  }
}

export const userWithProducts = {
  username: 'Some User',
  email: 'some_user@some-website.com',
  roles: ['org_user, product_user'],
  products: [{
    name: 'Some Product',
    slug: 'some_product'
  }],
  organization: {
    name: 'Some Organization',
    slug: 'some_organization'
  }
}

export const basicUser = {
  username: 'Some User',
  email: 'some_user@some-website.com',
  roles: ['user'],
  products: [],
  organization: null
}

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
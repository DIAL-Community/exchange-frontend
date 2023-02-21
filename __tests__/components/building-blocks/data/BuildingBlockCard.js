export const completeBuildingBlock = {
  name: 'Fake Building Block',
  slug: 'fake_bb',
  maturity: 'beta',
  imageFile: '/fake_bb.png',
  products: [{
    slug: 'product_a',
    name: 'Product A'
  }, {
    slug: 'product_b',
    name: 'Product B'
  }],
  workflows: [{
    slug: 'workflow_a',
    name: 'Workflow A'
  }, {
    slug: 'workflow_b',
    name: 'Workflow B'
  }]
}

export const minimalBuildingBlock = {
  name: 'Fake Building Block',
  slug: 'fake_bb',
  maturity: 'beta'
}

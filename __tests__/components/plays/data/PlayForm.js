export const play = {
  name: 'Play',
  slug: 'play',
  id: 3,
  playDescription: {
    description: 'desc play'
  },
  tags: ['tag_1','tag_2'],
  playbookSlug: 'playbook_1',
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
  buildingBlocks: [
    {
      name: 'bb 1',
      slug: 'bb_1'
    },
    {
      name: 'bb 2',
      slug: 'bb_2'
    }
  ],
  playMoves: [{
    name: 'test',
    slug: 'test',
    id: 1
  }]
}

export const playbook = {
  data: {
    playbook: {
      id: 4,
      slug: 'playbook_1',
      name: 'Playbook 1'
    }
  }
}

export const createPlaySuccess = {
  data: {
    createPlay: {
      play: {
        id: 7,
        name: 'Play',
        slug: 'play',
        description: 'desc',
        tags: ['Tag1','Tag2'],
        productsSlugs: ['product_1', 'product_2'],
        buildingBlocksSlugs: ['bb_1', 'bb_2'],
        playbookSlug: 'playbook_1'
      },
      errors: []
    }
  }
}

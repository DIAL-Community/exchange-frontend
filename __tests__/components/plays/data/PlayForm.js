export const play = {
  name: 'Play',
  slug: 'play',
  id: 3,
  playDescription: {
    description: 'desc play'
  },
  tags: ['tag_1','tag_2'],
  playbookSlug: 'playbook_1',
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
        playbookSlug: 'playbook_1'
      },
      errors: []
    }
  }
}

module.exports = {
  draftPlaybook: {
    id: 1,
    slug: 'example_playbook',
    name: 'Example Playbook',
    draft: true,
    playbookDescription: {
      id: 1,
      overview: 'Just an example of playbook.',
      audience: 'The audience of this playbook is you.',
      outcomes: 'The outcome of this playbook is expected.',
      __typename: 'PlaybookDescription'
    },
    playbookPlays: [{
      id: 827,
      playSlug: 'd4d_understand_the_problem',
      playName: 'D4D: Understand the Problem',
      order: 0,
      __typename: 'PlaybookPlay'
    }],
    plays: [{
      id: 10,
      slug: 'd4d_understand_the_problem',
      playMoves: [{
        id: 7,
        name: 'Considerations',
        __typename: 'Move'
      }, {
        id: 8,
        name: 'Key Questions',
        __typename: 'Move'
      }, {
        id: 9,
        name: 'Output',
        __typename: 'Move'
      }],
      __typename: 'Play'
    }],
    tags: [],
    __typename: 'Playbook'
  },
  publishedPlaybook: {
    id: 2,
    slug: 'example_playbook',
    name: 'Example Playbook',
    draft: false,
    playbookDescription: {
      id: 1,
      overview: 'Just an example of playbook.',
      audience: 'The audience of this playbook is you.',
      outcomes: 'The outcome of this playbook is expected.',
      __typename: 'PlaybookDescription'
    },
    playbookPlays: [{
      id: 827,
      playSlug: 'd4d_understand_the_problem',
      playName: 'D4D: Understand the Problem',
      order: 0,
      __typename: 'PlaybookPlay'
    }],
    plays: [{
      id: 10,
      slug: 'd4d_understand_the_problem',
      playMoves: [{
        id: 7,
        name: 'Considerations',
        __typename: 'Move'
      }, {
        id: 8,
        name: 'Key Questions',
        __typename: 'Move'
      }, {
        id: 9,
        name: 'Output',
        __typename: 'Move'
      }],
      __typename: 'Play'
    }],
    tags: [],
    __typename: 'Playbook'
  },
  testPlaybook: {
    id: 3,
    name: 'Test Playbook',
    slug: 'test_playbook',
    author: 'Test Playbook Author',
    playbookDescription: {
      id: 1,
      overview: 'Test Playbook Overview',
      audience: '',
      outcomes: ''
    },
    cover: '/test.jpg',
    plays: [],
    tags: [],
    draft: true
  },
  createPlaybookSuccess: {
    data: {
      createPlaybook: {
        playbook: {
          id: 3,
          name: 'Test Playbook',
          slug: 'test_playbook',
          tags: [],
          playbookDescription: {
            id: 1,
            overview: 'Test Playbook Overview',
            audience: '',
            outcomes: '',
          },
          plays: [],
          draft: true,
          __typename: 'Playbook'
        },
        errors: []
      }
    }
  }
}

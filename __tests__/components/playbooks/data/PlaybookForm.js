export const draftPlaybook = {
  id: 1,
  slug: 'example_playbook',
  name: 'Example Playbook',
  author: 'Test Author',
  draft: true,
  playbookDescription: {
    id: 1,
    overview: 'Just an example of playbook.',
    audience: 'The audience of this playbook is you.',
    outcomes: 'The outcome of this playbook is expected.',
    locale: 'en'
  },
  playbookPlays: [
    {
      id: 827,
      playSlug: 'd4d_understand_the_problem',
      playName: 'D4D: Understand the Problem',
      playOrder: 0
    }
  ],
  plays: [
    {
      id: 10,
      name: 'D4D: Understand the Problem',
      slug: 'd4d_understand_the_problem',
      playDescription: {
        id: 10,
        description: 'The play description goes here.'
      },
      playMoves: [
        {
          id: 7,
          name: 'Considerations'
        },
        {
          id: 8,
          name: 'Key Questions'
        },
        {
          id: 9,
          name: 'Output'
        }
      ]
    }
  ],
  tags: []
}

export const publishedPlaybook = {
  id: 2,
  slug: 'example_playbook',
  name: 'Example Playbook',
  author: 'Test Author',
  draft: false,
  playbookDescription: {
    id: 1,
    overview: 'Just an example of playbook.',
    audience: 'The audience of this playbook is you.',
    outcomes: 'The outcome of this playbook is expected.',
    locale: 'en'
  },
  playbookPlays: [
    {
      id: 827,
      playSlug: 'd4d_understand_the_problem',
      playName: 'D4D: Understand the Problem',
      order: 0
    }
  ],
  plays: [
    {
      id: 10,
      name: 'D4D: Understand the Problem',
      slug: 'd4d_understand_the_problem',
      playDescription: {
        id: 10,
        description: 'The play description goes here.'
      },
      playMoves: [
        {
          id: 7,
          name: 'Considerations'
        },
        {
          id: 8,
          name: 'Key Questions'
        },
        {
          id: 9,
          name: 'Output'
        }
      ]
    }
  ],
  tags: []
}

export const testPlaybook = {
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
}

export const createPlaybookSuccess = {
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
          outcomes: ''
        },
        plays: [],
        draft: true
      },
      errors: []
    }
  }
}

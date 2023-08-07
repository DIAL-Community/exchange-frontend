// Mocked data from playbook apollo queries.

export const searchPlaysResult = {
  data: {
    searchPlaybookPlays: {
      totalCount: 1,
      pageInfo: {
        endCursor: 'MQ',
        startCursor: 'MQ',
        hasPreviousPage: false,
        hasNextPage: false
      },
      nodes: [
        {
          id: 10,
          slug: 'd4d_understand_the_problem',
          name: 'D4D: Understand the Problem',
          author: 'Test Author',
          imageFile: '/assets/playbooks/playbook_placeholder.png',
          playDescription: {
            id: 10,
            description: 'The play description goes here.'
          },
          playMoves: [
            {
              id: 7,
              slug: 'considerations',
              name: 'Considerations'
            }
          ],
          products: [],
          buildingBlocks: []
        }
      ]
    }
  }
}

export const move = {
  data: {
    move: {
      id: 7,
      slug: 'considerations',
      name: 'Considerations',
      resources: [{
        i: 0,
        url: 'https://www.example.com/',
        name: 'Nyoman Ribeka',
        description: 'Adadadada'
      }],
      moveOrder: 1,
      moveDescription: {
        id: 7,
        description: 'Description of the move goes here.'
      }
    }
  }
}

export const playbook = {
  data: {
    playbook: {
      id: 4,
      slug: 'example_playbook',
      name: 'Example Playbook',
      imageFile: '/assets/playbooks/playbook_placeholder.png',
      author: 'Test Author',
      tags: ['Apps', 'Tag 2'],
      playbookDescription: {
        id: 4,
        overview: 'Just an example of playbook.',
        audience: 'The audience of this playbook is you.',
        outcomes: 'The outcome of this playbook is expected.',
        locale: 'en'
      },
      playbookPlays: [{
        id: 827,
        playSlug: 'd4d_understand_the_problem',
        playName: 'D4D: Understand the Problem',
        playOrder: 0
      }],
      plays: [{
        id: 10,
        name: 'D4D: Understand the Problem',
        slug: 'd4d_understand_the_problem',
        playDescription: {
          id: 10,
          description: 'The play description goes here.'
        },
        playMoves: [{
          id: 7,
          name: 'Considerations'
        }, {
          id: 8,
          name: 'Key Questions'
        }, {
          id: 9,
          name: 'Output'
        }]
      }],
      draft: false
    }
  }
}


// Mocked data from playbook apollo queries.

module.exports = {
  searchPlaysResult: {
    data: {
      searchPlaybookPlays: {
        __typename: 'PlayConnection',
        totalCount: 1,
        pageInfo: {
          endCursor: 'MQ',
          startCursor: 'MQ',
          hasPreviousPage: false,
          hasNextPage: false,
          __typename: 'PageInfo'
        },
        nodes: [
          {
            id: 10,
            slug: 'd4d_understand_the_problem',
            name: 'D4D: Understand the Problem',
            imageFile: '/assets/playbooks/playbook_placeholder.png',
            playDescription: {
              id: 10,
              description: 'The play description goes here.',
              __typename: 'PlayDescription'
            },
            playMoves: [
              {
                id: 7,
                slug: 'considerations',
                name: 'Considerations',
                __typename: 'Move'
              }
            ],
            products: [],
            buildingBlocks: [],
            __typename: 'Play'
          }
        ]
      }
    }
  },
  move: {
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
        order: 1,
        moveDescription: {
          id: 7,
          description: 'Description of the move goes here.',
          __typename: 'MoveDescription'
        },
        __typename: 'Move'
      }
    }
  },
  playbook: {
    data: {
      playbook: {
        id: 4,
        slug: 'example_playbook',
        name: 'Example Playbook',
        imageFile: '/assets/playbooks/playbook_placeholder.png',
        playbookDescription: {
          id: 4,
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
        draft: false,
        __typename: 'Playbook'
      }
    }
  }
}

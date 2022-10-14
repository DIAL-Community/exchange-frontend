export const playbookDetail = {
  id: 4,
  slug: 'example_playbook',
  name: 'Example Playbook',
  imageFile: '/assets/playbooks/playbook_placeholder.png',
  author: 'Test Author',
  playbookDescription: {
    id: 4,
    overview: 'Just an example of playbook.',
    audience: 'The audience of this playbook is you.',
    outcomes: 'The outcome of this playbook is expected.',
  },
  playbookPlays: [{
    id: 827,
    playSlug: 'd4d_understand_the_problem',
    playName: 'D4D: Understand the Problem',
    order: 0,
  }],
  plays: [{
    id: 10,
    slug: 'd4d_understand_the_problem',
    playMoves: [{
      id: 7,
      name: 'Considerations',
    }, {
      id: 8,
      name: 'Key Questions',
    }, {
      id: 9,
      name: 'Output',
    }],
  }],
  draft: false,
}

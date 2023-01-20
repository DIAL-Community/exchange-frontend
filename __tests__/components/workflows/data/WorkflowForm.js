export const workflow = {
  id: 1,
  name: 'Test Workflow',
  slug: 'test_workflow',
  workflowDescription: {
    description: '<p>test workflow description</p>',
    locale: 'en'
  },
  imageFile: './test.jpg',
  useCaseSteps: [],
  buildingBlocks: [
    {
      id: 3,
      name: 'Test Building Block',
      slug: 'test_building_block',
      maturity: 'BETA',
      imageFile: '/test-building-block.png'
    }
  ]
}

export const createWorkflowSuccess = {
  data: {
    createWorkflow: {
      workflow: {
        slug: 'test_workflow'
      },
      errors: []
    }
  }
}


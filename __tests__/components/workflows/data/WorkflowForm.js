export const workflow = {
  id: 1,
  name: 'Test Workflow',
  slug: 'test_workflow',
  imageFile: './test.jpg',
  workflowDescription: {
    description: '<p>test workflow description</p>',
    locale: 'en'
  },
  buildingBlocks: [
    {
      id: 3,
      name: 'Test Building Block',
      slug: 'test_building_block',
      maturity: 'BETA',
      imageFile: 'test-building-block.png'
    }
  ]
}
    
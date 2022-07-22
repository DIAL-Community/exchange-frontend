export const useCaseStep = {
  id: 1,
  name: 'UseCaseStep',
  slug: 'ucs',
  workflows: [
    {
      id: 1,
      name: 'Test Workflow',
      slug: 'tw'
    }
  ],
  products: [
    {
      id: 1,
      name: 'Test Product',
      slug: 'tp'
    }
  ]
}

export const createUseCaseStepSuccess = {
  data: {
    createUseCaseStep: {
      useCaseStep: {
        slug: 'test_use_case_step',
        useCase: {
          slug: 'test_use_case'
        }
      },
      errors: []
    }
  }
}

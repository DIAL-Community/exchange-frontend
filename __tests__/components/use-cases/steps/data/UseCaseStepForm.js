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
  ],
  datasets: [
    {
      id: 1,
      name: 'Test Dataset',
      slug: 'td'
    }
  ],
  buildingBlocks: [
    {
      id: 1,
      name: 'Test Building Block',
      slug: 'tbb'
    }
  ]
}

export const useCase = {
  buildingBlocks: [
    {
      id: 1,
      name: 'Test Building Block',
      slug: 'tbb'
    }
  ]
}

export const createUseCaseStepSuccess = {
  data: {
    createUseCaseStep: {
      useCaseStep: {
        id: 1,
        slug: 'test_use_case_step',
        useCase: {
          id: 1,
          slug: 'test_use_case'
        }
      },
      errors: []
    }
  }
}

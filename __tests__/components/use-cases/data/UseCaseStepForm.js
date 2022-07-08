export const useCaseStep = {
  name: 'Test Use Case Step',
  slug: 'test_use_case_step',
  stepNumber: 1,
  useCaseStepDescription: {
    description: 'test Use Case Step description',
    locale: 'en'
  },
  useCase: {
    id: 17,
    name: 'Test Use Case',
    slug: 'test_use_case'
  }
}

export const useCase = {
  id: 17,
  name: 'Test Use Case',
  slug: 'test_use_case'
}

export const createUseCaseStepSuccess = {
  data: {
    createUseCaseStep: {
      useCaseStep: {
        slug: 'test_use_case_step'
      },
      errors: []
    }
  }
}

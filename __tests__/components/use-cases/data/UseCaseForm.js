export const useCase = {
  id: 1,
  name: 'Test Use Case',
  slug: 'test_use_case',
  markdownUrl: 'Some-Markdown-URL',
  sector: {
    id: 1,
    name: 'Test Sector',
    slug: 'test_sector'
  },
  maturity: 'DRAFT',
  useCaseDescription: {
    description: 'Test Use Case Description'
  },
  sdgTargets: [{
    id: 1,
    name: 'Test SDG Target',
    targetNumber: '1',
    slug: 'ts',
    sustainableDevelopmentGoal: {
      slug: 'sdg_target_slug_1'
    }
  },
  {
    id: 2,
    name: 'Another SDG Target',
    targetNumber: '2',
    slug: 'as',
    sustainableDevelopmentGoal: {
      slug: 'sdg_target_slug_2'
    }
  }],
  tags: ['Test Tag']
}

export const sectors = {
  data: {
    sectors: [
      {
        id: 1,
        name: 'Test Sector',
        slug: 'test_sector'
      },
      {
        id: 2,
        name: 'Sector 2',
        slug: 'sector_2'
      }
    ]
  }
}

export const createUseCaseSuccess = {
  data: {
    createUseCase: {
      useCase: {
        id: 1,
        slug: 'test_use_case',
        useCase: {
          slug: 'test_use_case'
        }
      },
      errors: []
    }
  }
}

export const useCase = {
  id: 1,
  name: 'Test Use Case',
  slug: 'test_use_case',
  markdownUrl: 'Some-Markdown-URL',
  maturity: 'DRAFT',
  sector: {
    id: 1,
    name: 'Test Sector',
    slug: 'test_sector'
  },
  useCaseDescription: {
    locale: 'en',
    description: 'Test Use Case Description'
  },
  sdgTargets: [{
    id: 1,
    slug: 'ts',
    name: 'Test SDG Target',
    targetNumber: '1.1',
    sdgNumber: '1'
  }, {
    id: 2,
    slug: 'as',
    name: 'Another SDG Target',
    targetNumber: '2.1',
    sdgNumber: '2'
  }],
  workflows: [],
  buildingBlocks: [],
  useCaseHeader: {
    header: 'Some header'
  },
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

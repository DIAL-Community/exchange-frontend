export const useCaseDetail = {
  'data': {
    'useCase': {
      'id': '19',
      'name': 'Remote Learning',
      'slug': 'remote-learning',
      'sector': {
        'id': '198',
        'slug': 'education-and-social-development-duplicate-0',
        'name': 'Education and Social Development',
        '__typename': 'Sector'
      },
      'maturity': 'PUBLISHED',
      'imageFile': '/assets/use-cases/remote-learning.svg',
      'markdownUrl': null,
      'govStackEntity': false,
      'useCaseDescription': {
        'id': '3',
        'description': 'Description for the use case.',
        '__typename': 'UseCaseDescription'
      },
      'useCaseSteps': [
        {
          'id': '21',
          'name': 'Digital badge',
          'slug': 'digital-badge',
          'workflows': [
            {
              'id': '19',
              '__typename': 'Workflow'
            },
            {
              'id': '25',
              '__typename': 'Workflow'
            }
          ],
          'products': [],
          'buildingBlocks': [],
          '__typename': 'UseCaseStep'
        }
      ],
      'sdgTargets': [],
      'workflows': [
        {
          'id': '18',
          'name': 'Client Communication',
          'slug': 'client-communication',
          'imageFile': '/assets/workflows/client-communication.svg',
          '__typename': 'Workflow'
        }
      ],
      'buildingBlocks': [],
      'tags': [],
      '__typename': 'UseCase'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const createUseCase = {
  'data': {
    'createUseCase': {
      'useCase': {
        'id': '19',
        'slug': 'remote-learning',
        'name': 'Remote Learning - Edited',
        'maturity': 'PUBLISHED',
        'govStackEntity': false,
        'useCaseDescription': {
          'id': '3',
          'description': 'Description for the use case.',
          '__typename': 'UseCaseDescription'
        },
        'buildingBlocks': [],
        '__typename': 'UseCase'
      },
      'errors': [],
      '__typename': 'CreateUseCasePayload'
    }
  }
}

export const sectors = {
  'data': {
    'sectors': [
      {
        'id': '178',
        'name': 'Agriculture and Rural Development',
        'slug': 'agriculture-and-rural-development-duplicate-0',
        '__typename': 'Sector'
      }
    ]
  }
}

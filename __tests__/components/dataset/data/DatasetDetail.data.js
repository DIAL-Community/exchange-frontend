export const datasetDetail = {
  'data': {
    'dataset': {
      'id': '61',
      'name': 'AI Agro',
      'slug': 'ai-agro',
      'imageFile': '/assets/products/ai-agro.png',
      'website': 'rentadrone.cl/developers/ai-agro',
      'visualizationUrl': '',
      'geographicCoverage': null,
      'timeRange': null,
      'license': 'GPL-3.0',
      'languages': null,
      'datasetType': 'ai_model',
      'dataFormat': null,
      'tags': [],
      'datasetDescription': {
        'id': '11265',
        'description': 'Dataset description',
        'locale': 'en',
        '__typename': 'DatasetDescription'
      },
      'countries': [
        {
          'id': '119',
          'name': 'Australia',
          'slug': 'au',
          'code': 'AU',
          '__typename': 'Country'
        },
        {
          'id': '123',
          'name': 'Chile',
          'slug': 'cl',
          'code': 'CL',
          '__typename': 'Country'
        },
        {
          'id': '42',
          'name': 'Mexico',
          'slug': 'mx',
          'code': 'MX',
          '__typename': 'Country'
        },
        {
          'id': '111',
          'name': 'Peru',
          'slug': 'pe',
          'code': 'PE',
          '__typename': 'Country'
        }
      ],
      'origins': [
        {
          'id': '3',
          'name': 'Digital Public Goods Alliance',
          'slug': 'dpga',
          '__typename': 'Origin'
        }
      ],
      'organizations': [
        {
          'id': '750',
          'name': 'Rentadrone.cl',
          'slug': 'rentadronecl',
          'imageFile': '/assets/organizations/rentadronecl.png',
          '__typename': 'Organization'
        }
      ],
      'sdgsMapping': null,
      'sdgs': [],
      'sectors': [],
      'manualUpdate': false,
      '__typename': 'Dataset'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const createDataset = {
  'data': {
    'createDataset': {
      'dataset': {
        'id': '61',
        'name': 'AI Agro - Edited',
        'slug': 'ai-agro',
        'website': 'rentadrone.cl/developers/ai-agro',
        'datasetDescription': {
          'description': 'Dataset description',
          'locale': 'en',
          '__typename': 'DatasetDescription'
        },
        '__typename': 'Dataset'
      },
      'errors': [],
      '__typename': 'CreateDatasetPayload'
    }
  }
}

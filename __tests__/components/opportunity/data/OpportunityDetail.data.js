export const opportunityDetail = {
  'data': {
    'opportunity': {
      'id': '29',
      'slug': 'market-entry-in-north-macedonia',
      'name': 'Market entry in North Macedonia',
      'tags': [],
      'imageFile': '/assets/opportunities/opportunity-placeholder.png',
      'webAddress': 'app.leverist.de/en/opportunities/market-entry-in-north-macedonia',
      'description': 'Description for the opportunity',
      'opportunityStatus': 'OPEN',
      'opportunityType': 'OTHER',
      'closingDate': null,
      'openingDate': null,
      'contactName': null,
      'contactEmail': null,
      'govStackEntity': false,
      'origin': {
        'id': '7',
        'name': 'GIZ',
        'slug': 'giz',
        '__typename': 'Origin'
      },
      'buildingBlocks': [],
      'organizations': [],
      'useCases': [],
      'sectors': [],
      'countries': [
        {
          'id': '270',
          'slug': 'al',
          'name': 'Albania',
          'code': 'AL',
          '__typename': 'Country'
        },
        {
          'id': '128',
          'slug': 'xk',
          'name': 'Kosovo',
          'code': 'XK',
          '__typename': 'Country'
        },
        {
          'id': '151',
          'slug': 'mk',
          'name': 'North Macedonia',
          'code': 'MK',
          '__typename': 'Country'
        }
      ],
      '__typename': 'opportunity'
    }
  }
}

export const commentsQuery = { 'data': { 'comments': [] } }

export const createDataset = {
  'data': {
    'createOpportunity': {
      'opportunity': {
        'id': '29',
        'slug': 'market-entry-in-north-macedonia',
        'name': 'Market entry in North Macedonia - Edited',
        'tags': [],
        'imageFile': '/assets/opportunities/opportunity-placeholder.png',
        'webAddress': 'app.leverist.de/en/opportunities/market-entry-in-north-macedonia',
        'description': 'Description for the opportunity',
        'govStackEntity': false,
        'opportunityStatus': 'OPEN',
        'opportunityType': 'OTHER',
        'closingDate': '2024-05-04',
        'openingDate': '2024-05-03',
        'contactName': 'N/A',
        'contactEmail': 'N/A',
        'origin': {
          'id': '7',
          'name': 'GIZ',
          'slug': 'giz',
          '__typename': 'Origin'
        },
        '__typename': 'Opportunity'
      },
      'errors': [],
      '__typename': 'CreateOpportunityPayload'
    }
  }
}

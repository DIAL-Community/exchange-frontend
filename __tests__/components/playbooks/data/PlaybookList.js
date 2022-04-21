// Mocked data from playbook apollo queries.

module.exports = {
  'searchPlaybooks': {
    'data': {
      'searchPlaybooks': {
        '__typename': 'PlaybookConnection',
        'totalCount': 3,
        'pageInfo': {
          'endCursor': 'Mw',
          'startCursor': 'MQ',
          'hasPreviousPage': false,
          'hasNextPage': false,
          '__typename': 'PageInfo'
        },
        'nodes': [{
          'id': '2',
          'slug': 'cdr_analytics_for_covid19_with_f',
          'name': 'CDR Analytics for COVID-19 with FlowKit',
          'imageFile': '/assets/playbooks/playbook_placeholder.png',
          'tags': ['COVID-19', 'Chip cards'],
          'playbookDescription': {
            'id': '2',
            'overview': 'Overview of CDR Analytics for COVID-19 with FlowKit.',
            '__typename': 'PlaybookDescription'
          },
          '__typename': 'Playbook'
        }, {
          'id': '3',
          'slug': 'd4d_diagnostic_toolkit',
          'name': 'D4D Diagnostic Toolkit',
          'imageFile': '/assets/playbooks/d4d_diagnostic_toolkit.png',
          'tags': ['SMS services', 'Artificial Intelligence'],
          'playbookDescription': {
            'id': '3',
            'overview': 'D4D Diagnostic Toolkit',
            '__typename': 'PlaybookDescription'
          },
          '__typename': 'Playbook'
        }, {
          'id': '4',
          'slug': 'example_playbook',
          'name': 'Example Playbook',
          'imageFile': '/assets/playbooks/playbook_placeholder.png',
          'tags': ['3D Printers', 'Apps'],
          'playbookDescription': {
            'id': '4',
            'overview': 'Just an example of playbook.',
            '__typename': 'PlaybookDescription'
          },
          '__typename': 'Playbook'
        }]
      }
    }
  }
}

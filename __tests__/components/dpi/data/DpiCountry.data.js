export const countriesWithResources = {
  data: {
    countries: [
      {
        id: '10',
        name: 'Ethiopia',
        slug: 'et',
        code: 'ET',
        __typename: 'Country'
      },
      {
        id: '2',
        name: 'Kenya',
        slug: 'ke',
        code: 'KE',
        __typename: 'Country'
      },
      {
        id: '3',
        name: 'Uganda',
        slug: 'ug',
        code: 'UG',
        __typename: 'Country'
      },
      {
        id: '15',
        name: 'Zambia',
        slug: 'zm',
        code: 'ZM',
        __typename: 'Country'
      }
    ]
  }
}

export const countryResources = {
  data: {
    country: {
      id: '15',
      name: 'Zambia',
      slug: 'zm',
      code: 'ZM',
      codeLonger: 'ZMB',
      latitude: '-13.133897',
      longitude: '27.849332',
      resources: [
        {
          id: '113',
          name: 'National Digital Transformation Strategy Zambia',
          slug: 'national-digital-transformation-strategy-zambia',
          imageFile: '/assets/resources/resource-placeholder.svg',
          parsedDescription: 'Some description of the resource.',
          __typename: 'Resource'
        },
        {
          id: '114',
          name: 'Zambia\'s E- Government Interoperability Standard',
          slug: 'zambias-egovernment-interoperability-standard',
          imageFile: '/assets/resources/resource-placeholder.svg',
          parsedDescription: 'Some more of the description of the resource.',
          __typename: 'Resource'
        },
        {
          id: '115',
          name: 'Zambia\'s Smart Government Master Plan',
          slug: 'zambias-smart-government-master-plan',
          imageFile: '/assets/resources/resource-placeholder.svg',
          parsedDescription: 'Some description of the resource.',
          __typename: 'Resource'
        }
      ],
      'products': [
        {
          'id': '29',
          'name': 'RapidPro',
          'slug': 'rapidpro',
          'imageFile': '/assets/products/rapidpro.png',
          '__typename': 'Product'
        },
        {
          'id': '36',
          'name': 'KoboToolbox',
          'slug': 'kobotoolbox',
          'imageFile': '/assets/products/kobotoolbox.png',
          '__typename': 'Product'
        }
      ],
      'dpiProducts': [
        {
          'id': '29',
          'name': 'RapidPro',
          'slug': 'rapidpro',
          'imageFile': '/assets/products/rapidpro.png',
          '__typename': 'Product'
        },
        {
          'id': '36',
          'name': 'KoboToolbox',
          'slug': 'kobotoolbox',
          'imageFile': '/assets/products/kobotoolbox.png',
          '__typename': 'Product'
        }
      ],
      __typename: 'Country'
    }
  }
}

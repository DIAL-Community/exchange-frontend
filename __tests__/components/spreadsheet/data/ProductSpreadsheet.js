// Mocked data from spreasheet apollo queries.

export const mockedProductSpreadsheetData = {
  data: {
    spreadsheetProduct: [{
      id: 9,
      spreadsheetType: 'product',
      spreadsheetData: {
        name: 'Product A',
        aliases: '',
        website: 'https://a.com',
        license: 'MIT',
        tags: 'Tag M',
        submitterName: 'Submitter A',
        submitterEmail: 'nyoman.a@gmail.com',
        commercialProduct: false,
        sdgs: [],
        sectors: [],
        descriptions: [{
          locale: 'de',
          description: 'Description for product A.'
        }],
        organizations: []
      }
    },
    {
      id: 10,
      spreadsheetType: 'product',
      spreadsheetData: {
        name: 'Product B',
        sdgs: [],
        submitterEmail: 'nyoman.b@gmail.com',
        license: 'GPL',
        sectors: [],
        website: 'https://b.com',
        descriptions: [],
        organizations: [],
        tags: 'Tag G, Tag H',
        submitterName: 'Submitter B',
        commercialProduct: false
      }
    }],
    organizations: [{
      id: 190,
      name: 'AI4GOV',
      slug: 'ai4gov'
    }, {
      id: 6,
      name: 'APO-Coach, GbR',
      slug: 'apocoach_gbr'
    }],
    sectors: [{
      id: 178,
      name: 'Agriculture and Rural Development',
      slug: 'agriculture_and_rural_developmen'
    }, {
      id: 198,
      name: 'Education and Social Development',
      slug: 'education_and_social_development'
    }],
    sdgs: [{
      id: 26,
      name: 'No Poverty',
      slug: 'no_poverty',
      number: 1
    }, {
      id: 32,
      name: 'Zero Hunger',
      slug: 'zero_hunger',
      number: 2
    }],
    useCasesSteps: [{
      id: 26,
      name: 'Step One',
      slug: 'step_one',
      number: 1
    }, {
      id: 32,
      name: 'Step Two',
      slug: 'step_two',
      number: 2
    }],
    buildingBlocks: [{
      id: 26,
      name: 'No Poverty',
      slug: 'no_poverty',
      number: 1
    }, {
      id: 32,
      name: 'Zero Hunger',
      slug: 'zero_hunger',
      number: 2
    }]
  }
}

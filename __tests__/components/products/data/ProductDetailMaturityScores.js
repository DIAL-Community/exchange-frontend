export const overallMaturityScore = 80

export const maturityScoreDetails = [
  {
    id: 1,
    name: 'Global Utility',
    weight: '1.0',
    description: 'Global Utility',
    categoryIndicators: [
      {
        id: 1,
        name: 'Country Utilization',
        weight: '0.2',
        description: 'Country Utilization',
        score: '2.0'
      },
      {
        id: 2,
        name: 'Country Strategy',
        weight: '0.2',
        description: 'Country Strategy',
        score: '1.0'
      },
      {
        id: 3,
        name: 'Digital Health Interventions',
        weight: '0.2',
        description: 'Digital Health Interventions',
        score: '2.0'
      },
      {
        id: 4,
        name: 'Source Code Accessibility',
        weight: '0.2',
        description: 'Source Code Accessibility',
        score: '2.0'
      },
      {
        id: 5,
        name: 'Funding and Revenue',
        weight: '0.2',
        description: 'Funding and Revenue',
        score: '1.0'
      }
    ],
    missingScore: 0,
    overallScore: '8.0'
  },
  {
    id: 2,
    name: 'Community Support',
    weight: '1.0',
    description: 'Community Support',
    categoryIndicators: [
      {
        id: 6,
        name: 'Developer, Contributor and Implementor Community Engagement',
        weight: '0.2',
        description: 'Developer, Contributor and Implementor Community Engagement',
        score: '1.0'
      },
      {
        id: 7,
        name: 'Community Governance',
        weight: '0.2',
        description: 'Community Governance',
        score: '2.0'
      },
      {
        id: 8,
        name: 'Software Roadmap',
        weight: '0.2',
        description: 'Software Roadmap',
        score: '2.0'
      },
      {
        id: 9,
        name: 'User Documentation',
        weight: '0.2',
        description: 'User Documentation',
        score: '2.0'
      },
      {
        id: 10,
        name: 'Multi-Lingual Support',
        weight: '0.2',
        description: 'Multi-Lingual Support',
        score: '2.0'
      }
    ],
    missingScore: 0,
    overallScore: '9.0'
  },
  {
    id: 3,
    name: 'Software Maturity',
    weight: '1.0',
    description: 'Software Maturity',
    categoryIndicators: [
      {
        id: 11,
        name: 'Technical Documentation',
        weight: '0.2',
        description: 'Technical Documentation',
        score: '2.0'
      },
      {
        id: 12,
        name: 'Software Productization',
        weight: '0.2',
        description: 'Software Productization',
        score: '2.0'
      },
      {
        id: 13,
        name: 'Interoperability and Data Accessibility',
        weight: '0.2',
        description: 'Interoperability and Data Accessibility',
        score: '2.0'
      },
      {
        id: 14,
        name: 'Security',
        weight: '0.2',
        description: 'Security',
        score: '1.0'
      },
      {
        id: 15,
        name: 'Scalability',
        weight: '0.2',
        description: 'Scalability',
        score: '2.0'
      }
    ],
    missingScore: 0,
    overallScore: '9.0'
  },
  {
    id: 11,
    name: 'Impact',
    weight: '1.0',
    description: 'Impact',
    categoryIndicators: [
      {
        id: 72,
        name: 'IM10',
        weight: '0.5',
        description: 'Description text.',
        score: 0
      },
      {
        id: 73,
        name: 'IM20',
        weight: '0.5',
        description: 'Another description text.',
        score: 0
      }
    ],
    missingScore: 0,
    overallScore: 0
  },
  {
    id: 12,
    name: 'Financial Sustainability',
    weight: '1.0',
    description: 'Another description text.',
    categoryIndicators: [],
    missingScore: 0,
    overallScore: 0
  }
]

export const categoryIndicators = {
  data: {
    product: {
      id: '1',
      productIndicators: [
        {
          indicatorValue: 't',
          categoryIndicator: {
            slug: 'lc10',
            name: 'LC10',
            indicatorType: 'boolean',
            categoryIndicatorDescription: {
              description: 'Another description text.'
            },
            rubricCategory: {
              id: '5',
              name: 'Licenses and Copyright'
            }
          }
        },
        {
          indicatorValue: 'f',
          categoryIndicator: {
            slug: 'lc20',
            name: 'LC20',
            indicatorType: 'boolean',
            categoryIndicatorDescription: {
              description: 'Another description text.'
            },
            rubricCategory: {
              id: '5',
              name: 'Licenses and Copyright'
            }
          }
        },
        {
          indicatorValue: 'low',
          categoryIndicator: {
            slug: 're10',
            name: 'RE10',
            indicatorType: 'scale',
            categoryIndicatorDescription: {
              description: 'Another description text.'
            },
            rubricCategory: {
              id: '6',
              name: 'Software Releases'
            }
          }
        },
        {
          indicatorValue: 'medium',
          categoryIndicator: {
            slug: 're30',
            name: 'RE30',
            indicatorType: 'scale',
            categoryIndicatorDescription: {
              description: 'Another description text.'
            },
            rubricCategory: {
              id: '6',
              name: 'Software Releases'
            }
          }
        },
        {
          indicatorValue: '0',
          categoryIndicator: {
            slug: 'qu10',
            name: 'QU10',
            indicatorType: 'numeric',
            categoryIndicatorDescription: {
              description: 'Another description text.'
            },
            rubricCategory: {
              id: '7',
              name: 'Software Quality'
            }
          }
        },
        {
          indicatorValue: '1',
          categoryIndicator: {
            slug: 'qu11',
            name: 'QU11',
            indicatorType: 'numeric',
            categoryIndicatorDescription: {
              description: 'Another description text.'
            },
            rubricCategory: {
              id: '7',
              name: 'Software Quality'
            }
          }
        }
      ],
      notAssignedCategoryIndicators: [
        {
          slug: 'country_utilization',
          name: 'Country Utilization',
          indicatorType: 'scale',
          categoryIndicatorDescription: {
            description: '<p>Country Utilization</p>'
          },
          rubricCategory: {
            id: '5',
            name: 'Licenses and Copyright'
          }
        },
        {
          slug: 'cd30',
          name: 'CD30',
          indicatorType: 'boolean',
          categoryIndicatorDescription: {
            description: '<p>The code can be built in a reproducible way using widely available standard tools.</p>'
          },
          rubricCategory: {
            id: '4',
            name: 'Software Code'
          }
        },
        {
          slug: 'qu12',
          name: 'QU12',
          indicatorType: 'numeric',
          categoryIndicatorDescription: {
            description: '<p>The project&#39;s code uses mainstream revision control software, such as git.</p>'
          },
          rubricCategory: {
            id: '7',
            name: 'Software Quality'
          }
        }
      ]
    }
  }
}

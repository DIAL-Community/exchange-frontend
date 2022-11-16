export const maturityScore = { overallScore: 80 }

export const maturityScoreDetails = [
  {
    id: 1,
    name: 'Global Utility',
    weight: '1.0',
    description: 'Global Utility',
    indicator_scores: [
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
    missing_score: 0,
    overall_score: '8.0'
  },
  {
    id: 2,
    name: 'Community Support',
    weight: '1.0',
    description: 'Community Support',
    indicator_scores: [
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
    missing_score: 0,
    overall_score: '9.0'
  },
  {
    id: 3,
    name: 'Software Maturity',
    weight: '1.0',
    description: 'Software Maturity',
    indicator_scores: [
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
    missing_score: 0,
    overall_score: '9.0'
  },
  {
    id: 11,
    name: 'Impact',
    weight: '1.0',
    description: 'Impact',
    indicator_scores: [
      {
        id: 72,
        name: 'IM10',
        weight: '0.5',
        description: 'The project should be used in real applications and not just in demos. Because not all real-world implementations may be inspected publicly, in such cases statements providing as much details as possible about these implementations should be made.',
        score: 0
      },
      {
        id: 73,
        name: 'IM20',
        weight: '0.5',
        description: 'The project should be able to clearly make the case for its importance in the Development and/or Humanitarian sector(s).',
        score: 0
      }
    ],
    missing_score: 0,
    overall_score: 0
  },
  {
    id: 12,
    name: 'Financial Sustainability',
    weight: '1.0',
    description: '\n\nThis category measures whether a product is financially viable - is the project generating\nsufficient revenue to sustain operations and are costs well managed\n\n\n  Short description: Revenue generation and cost management\n  Is core category: Unknown\n  Priority: Deprioritized by DIAL\n\n\n',
    indicator_scores: [],
    missing_score: 0,
    overall_score: 0
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
              description: '<p>The code is released under one of the preferred copyleft licenses explained in our <a href=https://www.osc.dial.community/licensing-principles>Licensing Principles</a>.</p>'
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
              description: '<p>Libraries that are mandatory dependencies of the project&#39;s code do not create more restrictions than the project&#39;s license does.</p>'
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
              description: '<p>Releases consist of source code, distributed using standard and open archive formats that are expected to stay readable in the long term.</p>'
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
              description: '<p>Releases are signed and/or distributed along with digests that can be reliably used to validate the downloaded archives.</p>'
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
              description: '<p>The project is open and honest about the quality of its code. Various levels of quality and maturity for various modules are natural and acceptable as long as they are clearly communicated.</p>'
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
              description: '<p>In particular, there are either no monoliths or god classes, or they are known and there is a roadmap to refactor them.</p>'
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

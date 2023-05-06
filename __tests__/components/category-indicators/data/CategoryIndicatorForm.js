export const categoryIndicator = {
  id: 1,
  slug: 'test_category_indicator',
  name: 'Test Category Indicator',
  weight: 1,
  rubricCategorySlug: 'rubric_category_slug',
  indicatorType: 'numeric',
  dataSource: 'Test data source',
  scriptName: 'Test script name',
  categoryIndicatorDescription: {
    description: 'Test description'
  }
}

export const rubricCategory = {
  slug: 'rubric_category_slug'
}

export const createCategoryIndicatorSuccess = {
  data: {
    createCategoryIndicator: {
      categoryIndicator: {
        id: 1,
        slug: 'test_category_indicator'
      },
      errors: []
    }
  }
}

export const createCategoryIndicatorFailure = {
  data: {
    createCategoryIndicator: {
      errors: ['An error occurred']
    }
  }
}

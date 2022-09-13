export const rubricCategory = {
  name: 'Test rubric category',
  slug: 'test_rubric_category',
  weight: 1,
  rubricCategoryDescription: {
    description: 'RC description'
  }
}

export const createRubricCategorySuccess = {
  data: {
    createRubricCategory: {
      rubricCategory: {
        slug: 'test_rubric_category'
      },
      errors: []
    }
  }
}

export const createRubricCategoryFailure = {
  data: {
    createRubricCategory: {
      errors: ['An error occurred']
    }
  }
}

export const rubricCategory = {
  id: 1,
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
        id: 1,
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

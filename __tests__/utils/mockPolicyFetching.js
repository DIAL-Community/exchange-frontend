import * as policy from '../../components/utils/policy'

export const mockPolicyFetching = (mockAllowEditing = true, mockAllowDeleting = true) => {
  jest.spyOn(policy, 'fetchOperationPolicies').mockImplementation(() => {
    return Promise.resolve({
      editing: mockAllowEditing,
      deleting: mockAllowDeleting
    })
  })
}

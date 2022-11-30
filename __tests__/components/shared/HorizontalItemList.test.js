import React from 'react'
import HorizontalItemList from '../../../components/shared/HorizontalItemList'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()
describe('Unit test for the HorizontalItemList component.', () => {
  const HORIZONTAL_ITEMS_LIST_TEST_ID = 'horizontal-items-list'
  const NOT_APPLICABLE_TEST_ID = 'items-not-applicable'
  const REST_MARKER_TEST_ID = 'items-rest-marker'
  const mockComponentBody = 'Mock Component Body'

  jest.mock('react', () => ({
    useState: () => [true, jest.fn()]
  }))

  describe('Should match snapshot -', () => {
    test('when children length is equal to 0.', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <HorizontalItemList />
        </CustomMockedProvider>
      )
      expect(getByTestId(NOT_APPLICABLE_TEST_ID)).toBeVisible()
      expect(queryByTestId(REST_MARKER_TEST_ID)).toBeNull()
      expect(getByTestId(HORIZONTAL_ITEMS_LIST_TEST_ID)).toMatchSnapshot()
    })

    test('when container of items is not overflowing.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <HorizontalItemList>
            {mockComponentBody}
          </HorizontalItemList>
        </CustomMockedProvider>
      )
      expect(queryByTestId(NOT_APPLICABLE_TEST_ID)).toBeNull()
      expect(queryByTestId(REST_MARKER_TEST_ID)).toBeNull()
      expect(getByTestId(HORIZONTAL_ITEMS_LIST_TEST_ID)).toMatchSnapshot()
    })

    test('when container of items is overflowing.', () => {
      jest.spyOn(React, 'useState').mockImplementation(() => [{ isListOverflowing: true }, jest.fn()])

      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <HorizontalItemList>
            {mockComponentBody}
          </HorizontalItemList>
        </CustomMockedProvider>
      )
      expect(queryByTestId(NOT_APPLICABLE_TEST_ID)).toBeNull()
      expect(getByTestId(REST_MARKER_TEST_ID)).toBeVisible()
      expect(getByTestId(HORIZONTAL_ITEMS_LIST_TEST_ID)).toMatchSnapshot()
    })
  })
})

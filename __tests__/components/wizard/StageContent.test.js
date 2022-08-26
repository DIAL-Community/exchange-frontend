import { mockRouterImplementation, render } from '../../test-utils'
import { WizardStage1, WizardStage2 } from '../../../components/wizard/StageContent'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { projData, allValues } from './data/WizardStage'

jest.mock('next/dist/client/router')

describe('Unit test for the WizardStage1 component.', () => {

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot.', () => {
    const { container } = render(
      <CustomMockedProvider>
        <WizardStage1
          projData={projData}
          allValues={allValues}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('Unit test for the WizardStage2 component.', () => {

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot.', () => {
    const { container } = render(
      <CustomMockedProvider>
        <WizardStage2
          projData={projData}
          allValues={allValues}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

import { render } from '../../test-utils'
import { WizardStage1, WizardStage2 } from '../../../components/wizard/StageContent'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { projData, allValues } from './data/WizardStage'

mockNextUseRouter()
describe('Unit test for the WizardStage1 component.', () => {

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

mockNextUseRouter()
describe('Unit test for the WizardStage2 component.', () => {

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

import { screen } from '@testing-library/react'
import { render } from '../../test-utils'
import BuildingBlockCard from '../../../components/building-blocks/BuildingBlockCard'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { completeBuildingBlock, minimalBuildingBlock } from './data/BuildingBlockCard'

mockNextUseRouter()
describe('Unit tests for the building block card.', () => {
  test('Should render complete building block in list view.', () => {
    render(<BuildingBlockCard buildingBlock={completeBuildingBlock} listType='list' />)
    expect(screen.getByText(completeBuildingBlock.name)).toBeInTheDocument()

    const workflows = screen.getAllByText(completeBuildingBlock.workflows.map(w => w.name).join(', '))
    expect(workflows.length).toBe(1)

    const products = screen.getAllByText(completeBuildingBlock.products.map(p => p.name).join(', '))
    expect(products.length).toBe(1)

    expect(screen.getByText(completeBuildingBlock.name).closest('a'))
      .toHaveAttribute('href', `/building_blocks/${completeBuildingBlock.slug}`)
  })

  test('Should render minimal building block in list view.', () => {
    render(<BuildingBlockCard buildingBlock={minimalBuildingBlock} listType='list' />)
    expect(screen.getByText(minimalBuildingBlock.name)).toBeInTheDocument()

    expect(screen.getByText(minimalBuildingBlock.name).closest('a'))
      .toHaveAttribute('href', `/building_blocks/${minimalBuildingBlock.slug}`)

    expect(screen.queryByText(/Products/)).toBeNull()
    expect(screen.queryByText(/Workflows/)).toBeNull()
  })

  test('Should render building block in card view.', () => {
    render(<BuildingBlockCard buildingBlock={completeBuildingBlock} listType='card' />)

    expect(screen.queryByText(/Products:/)).toBeNull()
    expect(screen.queryByText(/Workflows:/)).toBeNull()

    expect(screen.getAllByText('2').length).toBe(2)
  })
})

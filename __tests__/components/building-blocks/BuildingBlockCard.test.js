import { useRouter } from 'next/router'
import { screen } from '@testing-library/react'
import { render } from '../../test-utils'
import BuildingBlockCard from '../../../components/building-blocks/BuildingBlockCard'

// Mock next-router calls.
jest.mock('next/dist/client/router')

const completeBuildingBlock = {
  name: 'Fake Building Block',
  slug: 'fake_bb',
  maturity: 'beta',
  imageFile: 'fake_bb.png',
  products: [{
    slug: 'product_a',
    name: 'Product A'
  }, {
    slug: 'product_b',
    name: 'Product B'
  }],
  workflows: [{
    slug: 'workflow_a',
    name: 'Workflow A'
  }, {
    slug: 'workflow_b',
    name: 'Workflow B'
  }]
}

const minimalBuildingBlock = {
  name: 'Fake Building Block',
  slug: 'fake_bb',
  maturity: 'beta'
}

describe('Unit tests for the building block card.', () => {
  beforeEach(() => {
    // Mocked router implementation.
    useRouter.mockImplementation(() => ({
      asPath: '/',
      locale: 'en',
      push: jest.fn(() => Promise.resolve(true)),
      prefetch: jest.fn(() => Promise.resolve(true)),
      events: {
        on: jest.fn(),
        off: jest.fn()
      }
    }))
  })

  test('Should render complete building block in list view.', () => {
    render(<BuildingBlockCard buildingBlock={completeBuildingBlock} listType='list' />)
    expect(screen.getByText(completeBuildingBlock.name)).toBeInTheDocument()

    // 2 workflow list: mobile view + desktop view
    const workflows = screen.getAllByText(completeBuildingBlock.workflows.map(w => w.name).join(', '))
    expect(workflows.length).toBe(2)

    // 2 product list: mobile view + desktop view
    const products = screen.getAllByText(completeBuildingBlock.products.map(p => p.name).join(', '))
    expect(products.length).toBe(2)

    expect(screen.getByText(completeBuildingBlock.name).closest('a'))
      .toHaveAttribute('href', `/building_blocks/${completeBuildingBlock.slug}`)

    expect(screen.getByText(/Products/)).toBeInTheDocument()
    expect(screen.getByText(/Workflows/)).toBeInTheDocument()
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

    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Product A')).toBeInTheDocument()
    expect(screen.getByText('Product B')).toBeInTheDocument()

    expect(screen.getByText('Workflows')).toBeInTheDocument()
    completeBuildingBlock.workflows.forEach(workflow => {
      expect(screen.getByAltText(`Logo for: ${workflow.name}`)).toBeInTheDocument()
    })
  })
})

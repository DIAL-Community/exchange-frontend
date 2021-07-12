import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import Breadcrumb from '../../shared/breadcrumb'
import WorkflowCard from '../../workflows/WorkflowCard'
import BuildingBlockCard from '../../building-blocks/BuildingBlockCard'
import ProductCard from '../../products/ProductCard'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

const USE_CASE_STEP_QUERY = gql`
  query UseCaseStep($slug: String!) {
    useCaseStep(slug: $slug) {
      id
      name
      slug
      useCaseStepDescriptions {
        description
        locale
      }
      useCase {
        slug
        name
      }
      workflows {
        name
        slug
        imageFile
      }
      products {
        name
        slug
        imageFile
      }
      buildingBlocks {
        name
        slug
        imageFile
      }
    }
  }
`

const UseCaseStepInformation = ({ useCaseStep }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const { locale } = useRouter()

  const slugNameMapping = (() => {
    const map = {}
    map[useCaseStep.useCase.slug] = useCaseStep.useCase.name
    map[useCaseStep.slug] = useCaseStep.name
    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(useCaseStep.useCaseStepDescriptions, locale))}
      </div>
      {
        useCaseStep.workflows && useCaseStep.workflows.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('workflow.header')}</div>
            <div className='grid grid-cols-1'>
              {useCaseStep.workflows.map((workflow, i) => <WorkflowCard key={i} workflow={workflow} listType='list' />)}
            </div>
          </div>
      }
      {
        useCaseStep.buildingBlocks && useCaseStep.buildingBlocks.length > 0 &&
          <div className='mt-12 mb-4'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('building-block.header')}</div>
            <div className='grid grid-cols-1'>
              {useCaseStep.buildingBlocks.map((buildingBlock, i) => <BuildingBlockCard key={i} buildingBlock={buildingBlock} listType='list' />)}
            </div>
          </div>
      }
      {
        useCaseStep.products && useCaseStep.products.length > 0 &&
          <div className='mt-12 mb-4'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('product.header')}</div>
            <div className='grid grid-cols-1'>
              {useCaseStep.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
            </div>
          </div>
      }
    </div>
  )
}

const StepDetail = ({ stepSlug }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { loading, data } = useQuery(USE_CASE_STEP_QUERY, { variables: { slug: stepSlug } })
  return (
    <>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('step.loading.indicator')}
          </div>
      }
      {
        data && data.useCaseStep &&
          <UseCaseStepInformation useCaseStep={data.useCaseStep} />
      }
    </>
  )
}

export default StepDetail

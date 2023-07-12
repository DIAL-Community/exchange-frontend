import Link from 'next/link'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../../context/FilterContext'
const useCasesPath = convertToKey('Use Cases')
const stepsPath = convertToKey('Use Case Steps')

const StepCard = ({ useCaseStep, stepSlug, listStyle }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  // Style the card based on the list style
  const cardContainerStyles = () => {
    if (listStyle === 'compact') {
      return [
        'text-use-case cursor-pointer border-transparent hover:border-r-2 hover:border-dial-sunshine',
        'border border-t-0'
      ]
    } else {
      return [
        'text-use-case border-3 border-transparent hover:border-dial-sunshine hover:text-dial-sunshine cursor-pointer',
        'border border-dial-gray hover:border-transparent shadow-md'
      ]
    }
  }

  const [hoverStyle, containerStyle] = cardContainerStyles()

  return (
    <Link href={`/${useCasesPath}/${useCaseStep.useCase.slug}/${stepsPath}/${useCaseStep.slug}`}>
      <div className={hoverStyle}>
        <div className={containerStyle}>
          <div className='flex flex-row'>
            <div className={`py-4 ${stepSlug && stepSlug === useCaseStep.slug ? 'bg-use-case' : 'bg-transparent'} w-1`}>
              &nbsp;
            </div>
            <div className='py-4 px-6'>
              <div className='text-base font-semibold'>{`${useCaseStep.stepNumber}. ${useCaseStep.name}`}</div>
            </div>
            <div className='bg-transparent w-1'>
              &nbsp;
            </div>
          </div>
          {
            listStyle !== 'compact' &&
              <>
                <div className='flex flex-row px-4 py-2 bg-dial-gray-light'>
                  <div className='text-sm text-workflow my-auto mr-2'>{format('workflow.header')}</div>
                  <div className='flex flex-row flex-wrap font-semibold overflow-hidden'>
                    {
                      useCaseStep.workflows.length === 0 &&
                        <span className='text-base my-1 mx-auto font-semibold'>
                          {format('general.na')}
                        </span>
                    }
                    {
                      useCaseStep.workflows
                        .map(workflow => (
                          <div key={`workflow-${workflow.slug}`} className='bg-white p-2 mr-1.5 cursor-default'>
                            <Image
                              height={25}
                              width={25}
                              data-tooltip-id='react-tooltip'
                              data-tooltip-content={
                                format(
                                  'tooltip.forEntity',
                                  { entity: format('workflow.label'), name: workflow.name }
                                )
                              }
                              alt={format('image.alt.logoFor', { name: workflow.name })} className='workflow-filter'
                              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                            />
                          </div>
                        ))
                    }
                  </div>
                </div>
                {useCaseStep.products.length > 0 &&
                  <div className='flex flex-row px-4 py-2 bg-dial-gray-light'>
                    <div className='text-sm text-workflow my-auto mr-2'>{format('product.header')}</div>
                    <div className='flex flex-row flex-wrap font-semibold overflow-hidden'>
                      <div className='mx-1 text-sm font-normal overflow-hidden text-ellipsis'>
                        {useCaseStep.products.map(p => p.name).join(', ')}
                      </div>
                    </div>
                  </div>}
              </>
          }
        </div>
      </div>
    </Link>
  )
}

export default StepCard

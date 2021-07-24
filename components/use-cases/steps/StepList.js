import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import StepCard from './StepCard'

const USE_CASE_STEPS_QUERY = gql`
query UseCaseSteps(
  $slug: String!
  ) {
  useCaseSteps(
    slug: $slug
  ) {
      id
      name
      slug
      stepNumber
      useCase {
        slug
      }
      workflows {
        slug
        name
        imageFile
      }
      products {
        name
        slug
        imageFile
      }
  }
}
`

const StepList = ({ useCaseSlug, stepSlug, listStyle, shadowOnContainer }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { loading, data } = useQuery(USE_CASE_STEPS_QUERY, {
    variables: {
      slug: useCaseSlug
    }
  })

  return (
    <div className={`${shadowOnContainer ? 'shadow-xl' : ''}`}>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('steps.loading.indicator')}
          </div>
      }
      {
        data &&
          data.useCaseSteps.map((useCaseStep, index) => (
            <StepCard key={index} useCaseStep={useCaseStep} stepSlug={stepSlug} listStyle={listStyle} />
          ))
      }
    </div>
  )
}

export default StepList

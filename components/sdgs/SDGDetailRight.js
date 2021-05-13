import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import UseCaseCard from '../use-cases/UseCaseCard'

const SDGDetailRight = ({ sdg }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className=''>
      <Breadcrumb />
      {
        sdg.sdgTargets &&
          sdg.sdgTargets.map(sdgTarget => {
            return (
              <div
                key={`${sdg.number}-${sdgTarget.targetNumber}`}
              >
                <div className='flex flex-row text-dial-gray-dark'>
                  <div className='flex-grow flex flex-col'>
                    <div className='text-2xl leading-8	'>
                      {`${format('sdg.target.title')}: ${sdgTarget.targetNumber}`}
                    </div>
                    <div className='text-base whitespace-normal	'>
                      {sdgTarget.name}
                    </div>
                  </div>
                  <img
                    className='w-12'
                    alt={`Logo for ${sdgTarget.targetNumber}`}
                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdgTarget.imageFile}
                  />
                </div>
                {
                  sdgTarget.useCases && sdgTarget.useCases.length > 0 &&
                    <div className='mt-4'>
                      <div className='text-use-case font-semibold mb-3'>
                        {format('useCase.header')}
                      </div>
                      <div className='grid grid-cols-1'>
                        {
                          sdgTarget.useCases.map((useCase, i) => (
                            <UseCaseCard key={i} useCase={useCase} listType='list' />
                          ))
                        }
                      </div>
                    </div>
                }
                <hr className='my-12' />
              </div>
            )
          })
      }
    </div>
  )
}

export default SDGDetailRight

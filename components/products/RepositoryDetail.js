import { useIntl, FormattedDate } from 'react-intl'
import { FaStar, FaEye, FaFile, FaCalendar, FaCalendarAlt, FaCode, FaCheck } from 'react-icons/fa'
import { CgGitFork } from 'react-icons/cg'

const RepositoryDetail = ({ repositoryData, languageData }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const lastUpdated = repositoryData && new Date(repositoryData.updatedAt)
  const lastThreeMonths = new Date()
  lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 4)
  const lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)

  const languages = languageData && languageData.languages.edges
  const totalLines = languageData && languageData.languages.totalSize
  const legends = []

  return (
    repositoryData
      ? (
        <>
          <div className='text-sm font-semibold'>
            {format('product.repository-info')}
            {
              lastUpdated >= lastThreeMonths &&
                (<div className='inline py-1 px-2 ml-4 h5 text-white bg-dial-teal rounded'>{format('product.very-active')}</div>)
            }
            {
              (lastUpdated > lastYear && lastUpdated < lastThreeMonths) &&
                (<div className='inline py-1 px-2 ml-4 h5 text-white bg-not-active rounded'>{format('product.not-very-active')}</div>)
            }
            {
              lastUpdated < lastYear &&
                (<div className='inline py-1 px-2 ml-4 h5 text-white bg-button-gray-light rounded'>{format('product.inactive')}</div>)
            }
          </div>
          <div className='card-body pt-3'>
            <div className='grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 text-dial-gray-dark text-sm'>
              <div className='pb-4'>
                <div><FaStar className='inline mr-2' />{format('product.star')}</div>
                <div>{repositoryData.stargazers && repositoryData.stargazers.totalCount}</div>
              </div>
              <div className='pb-4'>
                <div><FaEye className='inline mr-2' />{format('product.watcher')}</div>
                <div>{repositoryData.watchers && repositoryData.watchers.totalCount}</div>
              </div>
              <div className='pb-4'>
                <div><CgGitFork className='inline mr-2' />{format('product.fork')}</div>
                <div>{repositoryData.forkCount}</div>
              </div>
              <div className='pb-4'>
                <div><FaFile className='inline mr-2' />{format('product.current-version')}</div>
                {repositoryData.releases && repositoryData.releases.totalCount > 0
                  ? (<div>{repositoryData.releases.edges[0].node.name}</div>)
                  : (<div>{format('product.no-version-data')}</div>)}
              </div>
              <div className='pb-4'>
                <div><FaCalendar className='inline mr-2' />{format('product.created')}</div>
                <div><FormattedDate value={new Date(repositoryData.createdAt)} year='numeric' month='long' day='2-digit' /></div>
              </div>
              <div className='pb-4'>
                <div><FaCalendarAlt className='inline mr-2' />{format('product.last-updated')}</div>
                <div><FormattedDate value={new Date(repositoryData.updatedAt)} year='numeric' month='long' day='2-digit' /></div>
              </div>
              <div className='pb-4'>
                <div><FaCode className='inline mr-2' />{format('product.open-pr')}</div>
                <div>{repositoryData.openPullRequestCount && repositoryData.openPullRequestCount.totalCount}</div>
              </div>
              <div className='pb-4'>
                <div><FaCheck className='inline mr-2' />{format('product.merged-pr')}</div>
                <div>{repositoryData.mergedPullRequestCount && repositoryData.mergedPullRequestCount.totalCount}</div>
              </div>
            </div>
            {
              languageData &&
                <div>
                  <div className='text-sm font-semibold my-2'>
                    {format('product.languages')}
                  </div>
                  <div className='mb-2'>
                    <div className='progress flex'>
                      <style global jsx>{`
                        .progress-line {
                          width: calc(100% - 1.5rem - 1rem);
                          top: 50%;
                          transform: translate(-50%, -50%);
                        }
                        .progress-padding {
                          padding-top: 0.2rem;
                          padding-bottom: 0.2rem;
                        }
                      `}
                      </style>
                      {
                        languages && languages.map((language, i) => {
                          const langName = language.node.name
                          const bg = language.node.color

                          const size = language.size
                          const percentage = (size / totalLines * 10000) / 100

                          legends.push({ langName, bg, percentage })

                          const styles = {
                            width: `${percentage}%`,
                            backgroundColor: `${bg}`
                          }

                          return (
                            <div key={i} className='progress-padding' style={styles} />
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4'>
                    {legends.map((legend, i) => {
                      const styles = {
                        color: `${legend.bg}`,
                        fill: 'currentColor',
                        display: 'inline'
                      }

                      return (
                        <div key={i} className='inline'>
                          <svg style={styles} viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'>
                            <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8z' />
                          </svg>
                          <span className='text-gray-dark text-sm mx-2'>{legend.langName}</span>
                          <span>{legend.percentage.toFixed(2)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
            }
          </div>
        </>
      )
      : (<></>)
  )
}

export default RepositoryDetail

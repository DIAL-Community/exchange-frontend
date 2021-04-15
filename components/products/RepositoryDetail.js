import { useIntl } from 'react-intl'
import { FaStar, FaEye, FaFile, FaCalendar, FaCalendarAlt, FaCode, FaCheck } from 'react-icons/fa';
import { CgGitFork } from 'react-icons/cg';

const RepositoryDetail = ({ repositoryData, languageData }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const last_updated = repositoryData && new Date(repositoryData.updatedAt)
  const last_three_month = new Date();
  last_three_month.setMonth(last_three_month.getMonth() - 4);
  const last_year = new Date();
  last_year.setFullYear(last_year.getFullYear() - 1);

  const language_data = languageData && languageData.languages.edges
  const total_lines = languageData && languageData.languages.totalSize
  let legends = []

  return repositoryData ?
  (
    <>
      <div className='h4'>
        {format('product.repository-info')}
        { last_updated >= last_three_month &&
            (<button className='py-1 px-2 ml-4 h5 text-white bg-dial-teal rounded'>{format('product.very-active')}</button>)
        }
        { (last_updated > last_year && last_updated < last_three_month) &&
            (<button className='py-1 px-2 ml-4 h5 text-white bg-not-active rounded'>{format('product.not-very-active')}</button>)
        }
        { last_updated < last_year &&
            (<button className='py-1 px-2 ml-4 h5 text-white bg-button-gray-light rounded'>{format('product.inactive')}</button>)
        }
      </div>
      <div className='card-body pt-4'>
        <div className='grid grid-cols-4 text-dial-gray-dark text-sm'>
          <div className='pb-4'>
            <div><FaStar className='inline mr-2' />{format('product.star')}</div>
            <div>{repositoryData.stargazers && repositoryData.stargazers.totalCount}</div>
          </div>
          <div className='pb-4'>
            <div><FaEye className='inline mr-2' />{format('product.watcher')}</div>
            <div>{repositoryData.watchers && repositoryData.watchers.totalCount}</div>
          </div>
          <div className='pb-4'>
            <div><CgGitFork className='inline mr-2' />{ format('product.fork') }</div>
            <div>{ repositoryData.forkCount }</div>
          </div>
          <div className='pb-4'>
            <div><FaFile className='inline mr-2' />{ format('product.current-version') }</div>
            { repositoryData.releases && repositoryData.releases.totalCount > 0 ?
              (<div>{ repositoryData.releases.edges[0].node.name }</div>)
            :
              (<div>{ format('product.no-version-data') }</div>)
            }
          </div>
          <div className='pb-4'>
            <div><FaCalendar className='inline mr-2' />{ format('product.created') }</div>
            <div>{ new Date(repositoryData.createdAt).toDateString() }</div>
          </div>
          <div className='pb-4'>
            <div><FaCalendarAlt className='inline mr-2' />{ format('product.last-updated') }</div>
            <div>{ new Date(repositoryData.updatedAt).toDateString() }</div>
          </div>
          <div className='pb-4'>
            <div><FaCode className='inline mr-2' />{ format('product.open-pr') }</div>
            <div>{ repositoryData.openPullRequestCount && repositoryData.openPullRequestCount.totalCount }</div>
          </div>
          <div className='pb-4'>
            <div><FaCheck className='inline mr-2' />{ format('product.merged-pr') }</div>
            <div>{ repositoryData.mergedPullRequestCount && repositoryData.mergedPullRequestCount.totalCount }</div>
          </div>
        </div>
        { languageData && 
        <div>
          <div className='h4 mt-2 mb-2'>
            <strong>{format('product.languages')}</strong>
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
              { language_data && language_data.map((language, i) => {
                const langName = language.node.name
                const bg = language.node.color

                const size = language.size
                const percentage = (size / total_lines * 10000) / 100

                legends.push( {langName, bg, percentage})

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
          <div className='grid grid-cols-2'>
            { legends.map((legend, i) => {
              const styles = {
                color: `${legend.bg}`,
                fill: 'currentColor',
                display: 'inline'
              }
              return (<div key={i} className='inline'>
                <svg style={styles} viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'>
                  <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8z'></path>
                </svg>
                <span className='text-gray-dark text-sm mx-2'>{legend.langName}</span>
                <span>{legend.percentage.toFixed(2)}%</span>
              </div>)
            })
          }
          </div>
        </div>
      }
      </div>
    </>
  ) : (
    <div className='h4'>
      {format('product.repository-info')}
    </div>
  )
}

export default RepositoryDetail

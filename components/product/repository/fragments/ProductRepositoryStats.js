import { useIntl, FormattedDate } from 'react-intl'
import { useCallback } from 'react'

const ProductRepositoryStats = ({ statisticalData, languageData }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const repoLanguageData = languageData.data.repository
  const repoStatisticalData = statisticalData.data.repository

  const lastUpdated = repoStatisticalData?.updatedAt ? new Date(repoStatisticalData.updatedAt) : null

  const lastThreeMonths = new Date()
  lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 4)

  const lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)

  const languages = repoLanguageData && repoLanguageData.languages.edges
  const totalLines = repoLanguageData && repoLanguageData.languages.totalSize
  const legends = []

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-row gap-3'>
        <div className='text-lg font-semibold text-dial-blueberry'>
          {format('product.repository-info')}
        </div>
        <div className='flex ml-auto my-auto text-xs text-white'>
          {lastUpdated && lastUpdated >= lastThreeMonths && (
            <div className='py-1 px-3 bg-dial-iris-blue rounded'>
              {format('product.very-active')}
            </div>
          )}
          {lastUpdated && lastUpdated > lastYear && lastUpdated < lastThreeMonths && (
            <div className='py-1 px-2 bg-dial-sunshine rounded'>
              {format('product.not-very-active')}
            </div>
          )}
          {lastUpdated && lastUpdated < lastYear && (
            <div className='py-1 px-2 bg-dial-slate-500 rounded'>
              {format('product.inactive')}
            </div>
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.star')}
          </div>
          {repoStatisticalData?.stargazers?.totalCount}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.watcher')}
          </div>
          {repoStatisticalData?.watchers?.totalCount}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.fork')}
          </div>
          {repoStatisticalData.forkCount}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.current-version')}
          </div>
          {repoStatisticalData?.releases.totalCount > 0
            ? <div>{repoStatisticalData.releases.edges[0].node?.tagName}</div>
            : <div>{format('general.na')}</div>
          }
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.created')}
          </div>
          <FormattedDate
            value={new Date(repoStatisticalData.createdAt)}
            year='numeric'
            month='long'
            day='2-digit'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.last-updated')}
          </div>
          <FormattedDate
            value={new Date(repoStatisticalData.updatedAt)}
            year='numeric'
            month='long'
            day='2-digit'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.open-pr')}
          </div>
          {repoStatisticalData?.openPullRequestCount?.totalCount}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>
            {format('product.merged-pr')}
          </div>
          {repoStatisticalData?.mergedPullRequestCount?.totalCount}
        </div>
      </div>
      <hr className='border-b border-dial-blue-chalk my-4' />
      {repoLanguageData && (
        <div className='flex flex-col gap-3'>
          <div className='text-lg font-semibold text-dial-blueberry'>
            {format('product.languages')}
          </div>
          <div className='mb-2'>
            <div className='progress flex'>
              {languages &&
                languages.map((language, i) => {
                  const langName = language.node.name
                  const bg = language.node.color
                  const size = language.size
                  const percentage = ((size / totalLines) * 10000) / 100
                  legends.push({ langName, bg, percentage })
                  const styles = {
                    width: `${percentage}%`,
                    backgroundColor: `${bg}`
                  }

                  return <div key={i} className='repository-progress-padding' style={styles} />
                })}
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
                <div key={i} className='text-dial-stratos text-sm'>
                  <div className='flex flex-row gap-1 items-center'>
                    <svg
                      style={styles}
                      viewBox='0 0 16 16'
                      version='1.1'
                      width='16'
                      height='16'
                      aria-hidden='true'
                    >
                      <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8z' />
                    </svg>
                    <div>{legend.langName}</div>
                    <div>{legend.percentage.toFixed(2)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductRepositoryStats

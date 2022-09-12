import parse from 'html-react-parser'
import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'

const CategoryIndicatorDetailRight = ({ categoryIndicator, slugNameMapping }) => {
  const { formatMessage } = useIntl()

  const labelStyles = 'card-title mb-3'

  return (
    <div className='px-4 text-dial-gray-dark'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='mb-8'>
        <div className={labelStyles}>
          {formatMessage({ id: 'categoryIndicator.dataSource' })}
        </div>
        {categoryIndicator?.dataSource}
      </div>
      <div className='mb-8'>
        <div className={labelStyles}>
          {formatMessage({ id: 'categoryIndicator.scriptName' })}
        </div>
        {categoryIndicator?.scriptName}
      </div>
      <div>
        <div className={labelStyles}>
          {formatMessage({ id: 'app.description' })}
        </div>
        {parse(categoryIndicator?.categoryIndicatorDescription?.description)}
      </div>
    </div>
  )
}

export default CategoryIndicatorDetailRight
